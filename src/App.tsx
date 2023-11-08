import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import  { UserContext }  from '../src/contexts/context'
import { Home } from './pages/Home';
import { useState, useContext, useEffect } from 'react';
import { Discover } from './pages/Discover';
import { Indicators } from './pages/Indicators';
import { PesquisadoresPage } from './pages/PesquisadoresPage';
import { Login } from './pages/Login';


import { client } from './lib/apollo'
import { ApolloProvider } from "@apollo/client"

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { auth } from './lib/firebase';
import { Dashboard } from './pages/Dashboard';
import {GoogleAuthProvider, signInWithPopup, User} from 'firebase/auth'
import { Chat } from './pages/Chat';
import { Terms } from './pages/Terms';
import Researcher from './pages/Researcher';
import { StepOne } from './pages/StepOne';
import { StepTwo } from './pages/StepTwo';
import { BaremaPage } from './pages/BaremaPage';
import { HomePageSimcc } from './pages/HomePageSimcc';
import { Magazine } from './pages/Magazine';
import { Profnit } from './pages/Profnit';






//rotas protegidas


export const App = () => {
  
  const [urlTermExport, setUrlTermExport] = useState('');
  const [valoresSelecionadosExport, setValoresSelecionadosExport] = useState('');

  const [totalPublicacoes, setTotalPublicacoes] = useState('');
  const [totalPesquisadores, setTotalPesquisadores] = useState('');
  const [totalInstituicoes, setTotalInstituicoes] = useState('');

  const [distinct, setDistinct] = useState(false)

  const [valorDigitadoPesquisaDireta, setValorDigitadoPesquisaDireta] = useState('');

  const [estadoSelecionado, setEstadoSelecionado] = useState('');

  const [botaoPesquisadoresClicado, setBotaoPesquisadoresClicado] = useState(false);
  const [botaoTermosClicado, setBotaoTermosClicado] = useState(true);
  const [botaoResumoClicado, setBotaoResumoClicado] = useState(false);
  const [botaoAreasClicado, setBotaoAreasClicado] = useState(false);
  
  const [urlGeral, setUrlGeral] = useState('http://177.16.237.21:5001/');
  const [pesquisadoresSelecionadosGroupBarema, setPesquisadoresSelecionadosGroupBarema] = useState('');
  const [user, setUser] = useState<User>({} as User)
  const [isOn, setIsOn] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [intituicoesSelecionadasCheckbox, setIntituicoesSelecionadasCheckbox] = useState('');
  const [areasSelecionadasCheckbox, setAreasSelecionadasCheckbox] = useState('');

  const [valoresSelecionadosPopUp, setValoresSelecionadosPopUp] = useState('');
  const [isPopUpVisible, setIsPopUpVisible] = useState(false);
  const [idVersao, setIdVersao] = useState('1');

  const [idGraduateProgram, setIdGraduateProgram] = useState('0');

  useEffect(() => {
  setValoresSelecionadosPopUp(valoresSelecionadosExport)
}, [valoresSelecionadosExport]);





  return (
    <ApolloProvider client={client}>
      <Router>
        <UserContext.Provider  
        value={{
          urlTermExport, setUrlTermExport, 
          valoresSelecionadosExport, setValoresSelecionadosExport, 
          totalPublicacoes, setTotalPublicacoes, totalPesquisadores, 
          setTotalPesquisadores, totalInstituicoes, setTotalInstituicoes, 
          valorDigitadoPesquisaDireta, setValorDigitadoPesquisaDireta,
          botaoPesquisadoresClicado, setBotaoPesquisadoresClicado,
          botaoTermosClicado, setBotaoTermosClicado,
          botaoResumoClicado, setBotaoResumoClicado,
          botaoAreasClicado, setBotaoAreasClicado,
          urlGeral, setUrlGeral,
          pesquisadoresSelecionadosGroupBarema, setPesquisadoresSelecionadosGroupBarema,
          user, setUser,
          isOn, setIsOn,
          enabled, setEnabled,
          intituicoesSelecionadasCheckbox, setIntituicoesSelecionadasCheckbox,
          areasSelecionadasCheckbox, setAreasSelecionadasCheckbox,

          valoresSelecionadosPopUp, setValoresSelecionadosPopUp,
          isPopUpVisible, setIsPopUpVisible,
          distinct, setDistinct,

          estadoSelecionado, setEstadoSelecionado,
          
          //id versão define a versão do projeto (simcc, profnit e cimatec)
          idVersao, setIdVersao,


          idGraduateProgram, setIdGraduateProgram
          }}>
          <Routes>
            <Route path='/' >
            <Route path=':userId?' element={<Profnit/>}/>
            </Route>



            <Route path='/search' element={<StepTwo/>}/>
            <Route path='/bem-vindo' element={<HomePageSimcc/>}/>
            <Route path='/discover' element={<Discover/>}/>
           
            <Route path='/pesquisadoresSelecionados' element={<PesquisadoresPage/>}/>
           
            <Route path='/login' element={<Login/>}/>
            <Route path='/chat' element={<Chat/>}/>

            <Route path='/export-sucupira' element={<Login/>}/>
           

         

            <Route
            path='/result'
            element={
              idGraduateProgram !== "0" ? (
                <Home />
              ) : (
                <Navigate to='/' replace state={{}} />
              )
            }
          />


            
            

            <Route path='researcher'>
              <Route path=':program/:userId/:term?/:type?' element={<Researcher/>}/>
            </Route>

            <Route path='terms'>
              <Route path=':program?' element={<Terms/>}/>
            </Route>

            <Route path='magazine'>
              <Route path=':program?' element={<Magazine/>}/>
            </Route>

            <Route path='barema'>
              <Route path=':program?' element={<BaremaPage/>}/>
            </Route>

            <Route path='indicators'>
              <Route path=':program?' element={<Indicators/>}/>
            </Route>


            {user ? (
              <Route path='/dashboard' element={<Dashboard/>}/>
            ) : (
              <div></div>
            )}
            
          </Routes>
        </UserContext.Provider>
      </Router>
    </ApolloProvider>
  )
}

export default App