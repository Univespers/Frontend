export class CurrentStatus {

  public static GROUP_NAME = "Univespers";
  public static PROJECT_NAME = "Univespers";
  public static CURRENT_YEAR = new Date().getFullYear();
  public static CURRENT_VERSION = "2.0.1-alpha";

  public static PRODUCTION = false;

  public static DEBUG_MODE = true;
  public static MOCK = {
    AUTH: false,
    PERFIL: true,
    COLEGAS: false,
    CHAT: false
  };

}
