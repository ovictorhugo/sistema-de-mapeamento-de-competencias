import { createContext, useState } from "react"
import {GoogleAuthProvider, signInWithPopup, User} from 'firebase/auth'

interface UserContextType {
    valoresSelecionadosExport: string;
  setValoresSelecionadosExport: React.Dispatch<React.SetStateAction<string>>;

  urlTermExport: string,
  setUrlTermExport: React.Dispatch<React.SetStateAction<string>>;

  valorDigitadoPesquisaDireta: string,
  setValorDigitadoPesquisaDireta: React.Dispatch<React.SetStateAction<string>>;

  urlGeral: string,
  setUrlGeral: React.Dispatch<React.SetStateAction<string>>;

  botaoPesquisadoresClicado: boolean,
  setBotaoPesquisadoresClicado: React.Dispatch<React.SetStateAction<boolean>>;

  botaoTermosClicado: boolean,
  setBotaoTermosClicado: React.Dispatch<React.SetStateAction<boolean>>;

  botaoResumoClicado: boolean,
  setBotaoResumoClicado: React.Dispatch<React.SetStateAction<boolean>>;

  botaoAreasClicado: boolean,
  setBotaoAreasClicado: React.Dispatch<React.SetStateAction<boolean>>;

  totalPublicacoes: string,
  setTotalPublicacoes: React.Dispatch<React.SetStateAction<string>>;

  totalPesquisadores: string,
  setTotalPesquisadores: React.Dispatch<React.SetStateAction<string>>;

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
  }

  

export const UserContext = createContext<UserContextType>({
valoresSelecionadosExport: "",
setValoresSelecionadosExport: () => {},
urlTermExport: "",
setUrlTermExport: () => {},
valorDigitadoPesquisaDireta: "",
setValorDigitadoPesquisaDireta: () => {},
urlGeral: "",
setUrlGeral: () => {},
botaoPesquisadoresClicado: false,
setBotaoPesquisadoresClicado: () => {},
botaoTermosClicado: false,
setBotaoTermosClicado: () => {},
botaoResumoClicado: false,
setBotaoResumoClicado: () => {},
botaoAreasClicado: false,
setBotaoAreasClicado: () => {},
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

 valoresSelecionadosPopUp: "",
  setValoresSelecionadosPopUp: () => {},
  isPopUpVisible: false,
  setIsPopUpVisible: () => {},


  idGraduateProgram: "",
  setIdGraduateProgram: () => {},

  distinct: false,
  setDistinct: () => {},

  estadoSelecionado: "", 
  setEstadoSelecionado: () => {},

  idVersao: "", 
  setIdVersao: () => {},
});