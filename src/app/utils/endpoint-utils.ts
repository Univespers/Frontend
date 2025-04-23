import { HttpErrorResponse } from "@angular/common/http";
import { catchError, Observable, of, switchMap, throwError } from "rxjs";

export class EndpointUtils {

    // public static MOCK_RESPONSE_DELAY = 1500;
    // public static MOCK_RESPONSE_DELAY = 3000;
    public static MOCK_RESPONSE_DELAY = 500;

    constructor() {}
    
    // Translates server errors into error messages
    private static _errorHandler(errorData: HttpErrorResponse) {
        const errorMessage: ErrorResponse = {
            error: {
                message: errorData.error?.message?? errorData.error?.error?.message ?? "ERROR"
            }
        }
        switch(errorMessage.error.message) {
            case "EMAIL_NOT_FOUND":
                return throwError(() => new Error("Email não encontrado!"));
            case "NOT_FOUND":
                return throwError(() => new Error("Colega não encontrado!"));
            case "INVALID_PASSWORD":
                return throwError(() => new Error("Senha incorreta!"));
            case "USER_DISABLED":
                return throwError(() => new Error("Usuário desativado!"));
            case "EMAIL_EXISTS":
                return throwError(() => new Error("Esse email já existe!"));
            case "OPERATION_NOT_ALLOWED":
                return throwError(() => new Error("A entrada está desabilitada!"));
            case "TOO_MANY_ATTEMPTS_TRY_LATER":
                return throwError(() => new Error("Detectado atividades incomuns! Tente mais tarde!"));
            default:
                return throwError(() => new Error("Um erro ocorreu!"));
        } // TODO: (Endpoints) Definir erros
    }

    public static endpointHandler<Data extends Ok | Error | {}, Ok, Error extends ErrorResponse>(action: Observable<Data>) {
        return action.pipe(
            switchMap(authData => { // Server ok, but with an error = Server error
              const error = (authData as Error).error;
              if(error) {
                return throwError(() => new HttpErrorResponse({ error: error }));
              } else return of(authData as Ok);
            }),
            catchError(this._errorHandler) // Server error = Error message
        );
    }

    public static mockEndpoint<Data>(response: Data) {
        return new Observable<Data>((subscriber) => {
            setTimeout(() => {
            subscriber.next(response);
            subscriber.complete();
            }, EndpointUtils.MOCK_RESPONSE_DELAY);
        });
    }

}

export interface ErrorResponse {
    error: {
      message: "EMAIL_NOT_FOUND" | "NOT_FOUND" | "INVALID_PASSWORD" | "USER_DISABLED" | "EMAIL_EXISTS" | "OPERATION_NOT_ALLOWED" | "TOO_MANY_ATTEMPTS_TRY_LATER" | "ERROR"
    };
}