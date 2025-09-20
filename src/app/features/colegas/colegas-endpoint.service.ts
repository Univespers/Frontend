import { Injectable } from '@angular/core';
import { catchError, from, map, Observable, of, throwError } from 'rxjs';
import { and, collection, collectionData, doc, endAt, Firestore, getDoc, limit, limitToLast, or, orderBy, query, startAt, where } from '@angular/fire/firestore';

import { CurrentStatus } from 'src/app/current-status';
import { EstudanteDataModel, EstudanteDoc, PerfilDataModel, PerfilDoc } from '../endpoint.model';

export interface ColegaResponse {
  uid: string;
  nome: string;
  curso: string;
  polo: string;
}
export interface ColegaContatoResponse {
  nome: string;
  url: string;
}
export interface ColegaDetailsResponse {
  uid: string;
  nome: string;
  cursoUID: string;
  poloUID: string;
  emailInstitucional: string;
  telefone?: string;
  temWhatsapp?: boolean;
  descricao?: string;
  contatos?: ColegaContatoResponse[]
}
export interface ColegaListResponse {
  colegasList: ColegaResponse[];
  indexUID: string;
  totalPages: number;
  isLastPage: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ColegasEndpointService {

  constructor(
    private fireStore: Firestore
  ) {}

  // Get Colega
  public getColega(uid: string): Observable<ColegaResponse> {
    if(CurrentStatus.MOCK.COLEGAS) {
      if(CurrentStatus.DEBUG_MODE) console.log("[COLEGAS_ENDPOINT] MOCK GetColega");
      return of({
        "uid": "Aluno1_UID",
        "nome": "Aluno1",
        "curso": "Curso1",
        "polo": "Polo"
      });
    }

    if(CurrentStatus.DEBUG_MODE) console.log("[COLEGAS_ENDPOINT] GetColega: DOING");
    return from(
      getDoc(doc(this.fireStore, EstudanteDataModel.estudanteDoc.collection, uid))
        .then(data => {
          if(!data.exists) throw new Error("Colega não existe!");
          if(CurrentStatus.DEBUG_MODE) console.log("[COLEGAS_ENDPOINT] GetColega: DONE");
          const colega = <EstudanteDoc>data.data();
          return {
            uid: colega.uid,
            nome: colega.nome,
            curso: colega.curso,
            polo: colega.polo
          };
        })
        .catch((error) => {
          if(CurrentStatus.DEBUG_MODE) console.log("[COLEGAS_ENDPOINT] GetColega: ERROR");
          if(CurrentStatus.DEBUG_MODE) console.log(error);
        })
    ).pipe(
      map(data => {
        if(!data) throw new Error("Colega não existe!");
        return data;
      })
    );
  }

  // Get Colega Details
  public getColegaDetails(uid: string): Observable<ColegaDetailsResponse> {
    if(CurrentStatus.MOCK.COLEGAS) {
      if(CurrentStatus.DEBUG_MODE) console.log("[COLEGAS_ENDPOINT] MOCK GetColegaDetails");
      return of(uid == "Aluno1_UID" ? {
        "uid": "Aluno1_UID",
        "nome": "Aluno1",
        "cursoUID": "Curso1_UID",
        "poloUID": "Polo1_UID",
        "emailInstitucional": "aluno1@estudante.com",
        "telefone": "(00) 90000-0000",
        "temWhatsapp": true,
        "descricao": "Oy! Hellow!",
        "contatos": [
          { "nome": "email", "url": "aluno1@email.com" },
          { "nome": "linkedin", "url": "aluno1@linkedin" },
          { "nome": "github", "url": "aluno1@github" },
          { "nome": "discord", "url": "aluno1@discord" },
        ]
      } : uid == "Aluno2_UID" ? {
        "uid": "Aluno2_UID",
        "nome": "Aluno2",
        "cursoUID": "Curso2_UID",
        "poloUID": "Polo2_UID",
        "emailInstitucional": "aluno2@estudante.com",
        "contatos": [
          { "nome": "email", "url": "aluno1@email.com" }
        ]
      } : uid == "Aluno3_UID" ? {
        "uid": "Aluno3_UID",
        "nome": "Aluno3",
        "cursoUID": "Curso3_UID",
        "poloUID": "Polo3_UID",
        "emailInstitucional": "aluno3@estudante.com",
        "telefone": "(00) 90000-0000",
        "temWhatsapp": false,
        "descricao": "Alooo!",
        "contatos": [
          { "nome": "email", "url": "aluno3@email.com" },
          { "nome": "facebook", "url": "aluno3@facebook" },
          { "nome": "instagram", "url": "aluno3@instagram" },
          { "nome": "reddit", "url": "aluno3@reddit" }
        ]
      } : {
        "uid": "Aluno_UID",
        "nome": "Aluno",
        "emailInstitucional": "aluno@estudante.com",
        "cursoUID": "Curso_UID",
        "poloUID": "Polo_UID"
      });
    }

    if(CurrentStatus.DEBUG_MODE) console.log("[COLEGAS_ENDPOINT] GetColegaDetails: DOING");
    return from(
      getDoc(doc(this.fireStore, PerfilDataModel.perfilDoc.collection, uid))
        .then(data => {
          if(!data.exists) throw new Error("Colega não existe!");
          if(CurrentStatus.DEBUG_MODE) console.log("[COLEGAS_ENDPOINT] GetColegaDetails: DONE");
          const colega = <PerfilDoc>data.data();
          return {
            uid: colega.uid,
            nome: colega.nome,
            cursoUID: colega.curso_uid,
            poloUID: colega.polo_uid,
            emailInstitucional: colega.email_institucional,
            telefone: colega.telefone,
            temWhatsapp: colega.tem_whatsapp,
            descricao: colega.descricao,
            contatos: <ColegaContatoResponse[]>[]
          };
        })
        .catch((error) => {
          if(CurrentStatus.DEBUG_MODE) console.log("[COLEGAS_ENDPOINT] GetColegaDetails: ERROR");
          if(CurrentStatus.DEBUG_MODE) console.log(error);
        })
    ).pipe(
      map(data => {
        if(!data) throw new Error("Colega não existe!");
        return data;
      })
    );
  }

  // Search Colegas
  public searchColegas(searchQuery: string, pageSize: number, indexUID: string = "", direction?: "prev"|""|"next"): Observable<ColegaListResponse> {
    if(CurrentStatus.MOCK.COLEGAS) {
      if(CurrentStatus.DEBUG_MODE) console.log("[COLEGAS_ENDPOINT] MOCK SearchColegas");
      return of({
        colegasList: [
          {
              "uid": "Aluno1_UID",
              "nome": "Aluno1",
              "curso": "Curso1",
              "polo": "Polo_"
          },
          {
              "uid": "Aluno2_UID",
              "nome": "Aluno2",
              "curso": "Curso2",
              "polo": "Polo_"
          },
          {
              "uid": "Aluno3_UID",
              "nome": "Aluno3",
              "curso": "Curso3",
              "polo": "Polo_"
          }
        ],
        indexUID: "Aluno3_UID",
        totalPages: 1,
        isLastPage: true
      });
    }

    const searchQueryData = (searchQuery: string, fieldName: string) => {
      return or(
        and(
          where(fieldName, ">=", searchQuery),
          where(fieldName, "<=", searchQuery + "\uf8ff")
        ),
        and(
          where(fieldName, ">=", searchQuery.charAt(0).toUpperCase() + searchQuery.slice(1)),
          where(fieldName, "<=", searchQuery.charAt(0).toUpperCase() + searchQuery.slice(1) + "\uf8ff")
        ),
        and(
          where(fieldName, ">=", searchQuery.toLowerCase()),
          where(fieldName, "<=", searchQuery.toLowerCase() + "\uf8ff")
        )
      );
    }

    const pageSizePlusExtra = pageSize + 1; // Adiciona um elemento extra para descobrir se existe uma próxima página

    if(CurrentStatus.DEBUG_MODE) console.log("[COLEGAS_ENDPOINT] SearchColegas: DOING");
    const collRef = collection(this.fireStore, EstudanteDataModel.estudanteDoc.collection);
    let queryData;
    if(indexUID && direction) { // Retornar com paginação
      if(CurrentStatus.DEBUG_MODE) console.log("[COLEGAS_ENDPOINT] Index UID: " + indexUID);
      if(CurrentStatus.DEBUG_MODE) console.log("[COLEGAS_ENDPOINT] Search direction: " + direction);
      switch(direction) {
        case "prev": // Ordena tudo antes de indexUID, e retorna os últimos
          queryData = query(collRef, searchQueryData(searchQuery, "nome"), orderBy("uid"), endAt(indexUID), limitToLast(pageSizePlusExtra));
          break;
        case "next": // Ordena tudo depois de indexUID, e retorna os primeiros
          queryData = query(collRef, searchQueryData(searchQuery, "nome"), orderBy("uid"), startAt(indexUID), limit(pageSizePlusExtra));
          break;
      }
    } else { // Retornar do começo
      if(CurrentStatus.DEBUG_MODE) console.log("[COLEGAS_ENDPOINT] Paginate: First page");
      // Ordena tudo, e retorna os primeiros
      queryData = query(collRef, searchQueryData(searchQuery, "nome"), orderBy("uid"), limit(pageSizePlusExtra));
    }
    return collectionData(queryData).pipe(
      map(data => {
        if(CurrentStatus.DEBUG_MODE) console.log("[COLEGAS_ENDPOINT] Page size (With extra): " + data.length);
        // "Sacrifica" um elemento para descobrir se existe uma próxima página
        let isLastPage = (data.length <= pageSize);
        if(!isLastPage) indexUID = ((data as EstudanteDoc[]).pop()?.uid ?? "");

        const colegasList: ColegaResponse[] = (data as EstudanteDoc[]).map(estudante => {
          return {
            uid: estudante.uid,
            nome: estudante.nome,
            curso: estudante.polo,
            polo: estudante.curso
          }
        })
        if(CurrentStatus.DEBUG_MODE) console.log("[COLEGAS_ENDPOINT] SearchColegas: DONE");
        return {
          colegasList: colegasList,
          indexUID: indexUID,
          totalPages: 1, // Valor desconhecido
          // TODO: [COLEGAS_ENDPOINT] Adicionar um total de páginas? Isso requer paginar no frontend
          isLastPage: isLastPage
        }
      }),
      catchError((error) => {
        if(CurrentStatus.DEBUG_MODE) console.log("[COLEGAS_ENDPOINT] SearchColegas: ERROR");
        if(CurrentStatus.DEBUG_MODE) console.log(error);
        return throwError(() => error);
      })
    );
  }

}
