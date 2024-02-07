import { createContext, useState } from "react"
import {GoogleAuthProvider, signInWithPopup, User as FirebaseAuthUser} from 'firebase/auth'


interface User extends FirebaseAuthUser {
  img_url: string;
  state: string;
  name: string
  email: string
  institution_id: string
}

interface UserContextType {
    valoresSelecionadosExport: string;
  setValoresSelecionadosExport: React.Dispatch<React.SetStateAction<string>>;

  urlTermExport: string,
  setUrlTermExport: React.Dispatch<React.SetStateAction<string>>;

  valorDigitadoPesquisaDireta: string,
  setValorDigitadoPesquisaDireta: React.Dispatch<React.SetStateAction<string>>;

  urlGeral: string,
  setUrlGeral: React.Dispatch<React.SetStateAction<string>>;
  
  botaoPatentesClicado: boolean, 
  setBotaoPatentesClicado: React.Dispatch<React.SetStateAction<boolean>>;

  botaoTaxonomiaClicado: string,
  setBotaoTaxonomiaClicado:  React.Dispatch<React.SetStateAction<string>>;

  botaoLivrosCapitulosClicado: boolean,
  setBotaoLivrosCapitulosClicado: React.Dispatch<React.SetStateAction<boolean>>;

  botaoEventosClicado: boolean,
  setBotaoEventosClicado: React.Dispatch<React.SetStateAction<boolean>>;

  botaoPesquisadoresClicado: boolean,
  setBotaoPesquisadoresClicado: React.Dispatch<React.SetStateAction<boolean>>;

  botaoTermosClicado: boolean,
  setBotaoTermosClicado: React.Dispatch<React.SetStateAction<boolean>>;

  botaoResumoClicado: boolean,
  setBotaoResumoClicado: React.Dispatch<React.SetStateAction<boolean>>;

  botaoAreasClicado: boolean,
  setBotaoAreasClicado: React.Dispatch<React.SetStateAction<boolean>>;
  
  EstadoFiltro: boolean,
  setEstadoFiltro: React.Dispatch<React.SetStateAction<boolean>>;

  totalPublicacoes: string,
  setTotalPublicacoes: React.Dispatch<React.SetStateAction<string>>;

  totalPesquisadores: string,
  setTotalPesquisadores: React.Dispatch<React.SetStateAction<string>>;

  idBarema: string, 
  setIdBarema: React.Dispatch<React.SetStateAction<string>>;

  totalInstituicoes: string,
  setTotalInstituicoes: React.Dispatch<React.SetStateAction<string>>;

  pesquisadoresSelecionadosGroupBarema: string,
  setPesquisadoresSelecionadosGroupBarema: React.Dispatch<React.SetStateAction<string>>;

  user: User,
  setUser: React.Dispatch<React.SetStateAction<User>>;

  isOn: boolean,
  setIsOn: React.Dispatch<React.SetStateAction<boolean>>;
  
  enabled: boolean,
  setEnabled:React.Dispatch<React.SetStateAction<boolean>>;

  loggedIn: boolean,
  setLoggedIn:React.Dispatch<React.SetStateAction<boolean>>;

  intituicoesSelecionadasCheckbox: string,
  setIntituicoesSelecionadasCheckbox: React.Dispatch<React.SetStateAction<string>>;

  areasSelecionadasCheckbox: string,
  setAreasSelecionadasCheckbox: React.Dispatch<React.SetStateAction<string>>;

  valoresSelecionadosPopUp: string,
  setValoresSelecionadosPopUp: React.Dispatch<React.SetStateAction<string>>;

  isPopUpVisible: boolean,
  setIsPopUpVisible: React.Dispatch<React.SetStateAction<boolean>>;

  idGraduateProgram: string,
  setIdGraduateProgram: React.Dispatch<React.SetStateAction<string>>;

  distinct:boolean,
  setDistinct: React.Dispatch<React.SetStateAction<boolean>>;

  estadoSelecionado: string, 
  setEstadoSelecionado: React.Dispatch<React.SetStateAction<string>>;

  idVersao:string,
  setIdVersao: React.Dispatch<React.SetStateAction<string>>;

  filtroAreas:string,
  setFiltroAreas: React.Dispatch<React.SetStateAction<string>>;

  valoresSelecionadosNuvem:string,
setValoresSelecionadosNuvem:  React.Dispatch<React.SetStateAction<string>>;

cidadeSelecionada:string, 
setCidadeSelecionada:  React.Dispatch<React.SetStateAction<string>>;
  }

  

export const UserContext = createContext<UserContextType>({
valoresSelecionadosExport: "",
setValoresSelecionadosExport: () => {},
urlTermExport: "",
setUrlTermExport: () => {},
valorDigitadoPesquisaDireta: "",
setValorDigitadoPesquisaDireta: () => {},
cidadeSelecionada:"",
setCidadeSelecionada: () => {},
valoresSelecionadosNuvem: "",
setValoresSelecionadosNuvem: () => {},
urlGeral: "",
setUrlGeral: () => {},
botaoPatentesClicado:  false,
setBotaoPatentesClicado: () => {},
botaoPesquisadoresClicado: false,
setBotaoPesquisadoresClicado: () => {},
botaoTermosClicado: false,
setBotaoTermosClicado: () => {},
botaoResumoClicado: false,
setBotaoResumoClicado: () => {},
loggedIn:false,
setLoggedIn: () => {},
botaoAreasClicado: false,
setBotaoAreasClicado: () => {},
botaoLivrosCapitulosClicado: false,
setBotaoLivrosCapitulosClicado: () => {},

botaoEventosClicado: false,
setBotaoEventosClicado: () => {},
EstadoFiltro: false,
setEstadoFiltro: () => {},
botaoTaxonomiaClicado: "",
setBotaoTaxonomiaClicado:  () => {},
totalPublicacoes: "", 
setTotalPublicacoes: () => {},
totalPesquisadores: "", 
setTotalPesquisadores: () => {},
totalInstituicoes: "", 
setTotalInstituicoes: () => {},
pesquisadoresSelecionadosGroupBarema: "",
setPesquisadoresSelecionadosGroupBarema: () => {},
user: {} as User,
setUser: () => {},
isOn: false,
setIsOn: () => {},
enabled: false,
setEnabled:() => {},
intituicoesSelecionadasCheckbox: "", 
 setIntituicoesSelecionadasCheckbox: () => {},
 areasSelecionadasCheckbox: "",
 setAreasSelecionadasCheckbox: () => {},
 filtroAreas:"",
 setFiltroAreas: () => {},

 valoresSelecionadosPopUp: "",
  setValoresSelecionadosPopUp: () => {},
  isPopUpVisible: false,
  setIsPopUpVisible: () => {},

  idBarema: "", 
  setIdBarema: () => {},

  idGraduateProgram: "",
  setIdGraduateProgram: () => {},

  distinct: false,
  setDistinct: () => {},

  estadoSelecionado: "", 
  setEstadoSelecionado: () => {},

  idVersao: "", 
  setIdVersao: () => {},

  
});