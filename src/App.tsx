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
import { GraduationsMapPage } from './pages/GraduationsMapPage';
import { PaginaInicial } from './pages/PaginaInicial';
import { SignUp } from './pages/SignUp';
import { LoginAdmin } from './pages/LoginAdmin';
import { Admin } from './pages/Admin';
import { MeusBaremas } from './pages/MeusBaremas';
import { Configuracoes } from './pages/Configuracoes';
import { Taxonomia } from './components/Taxonomia';
import { POST } from './components/chat/route';
import { Cidades } from './pages/Cidades';







//rotas protegidas


export const App = () => {
  
  const [urlTermExport, setUrlTermExport] = useState('');
  const [valoresSelecionadosExport, setValoresSelecionadosExport] = useState(``);
  const [valoresSelecionadosNuvem, setValoresSelecionadosNuvem] = useState(``);

  const [cidadeSelecionada, setCidadeSelecionada] = useState(``);

  const [loggedIn, setLoggedIn] = useState(false);

  const [totalPublicacoes, setTotalPublicacoes] = useState('');
  const [totalPesquisadores, setTotalPesquisadores] = useState('');
  const [totalInstituicoes, setTotalInstituicoes] = useState('');

  const [distinct, setDistinct] = useState(false)

  const [valorDigitadoPesquisaDireta, setValorDigitadoPesquisaDireta] = useState('');

  const [estadoSelecionado, setEstadoSelecionado] = useState('');

  const [EstadoFiltro, setEstadoFiltro] = useState(false)
  const [filtroAreas, setFiltroAreas] = useState('')

  const [botaoPatentesClicado, setBotaoPatentesClicado] = useState(false)
  const [botaoPesquisadoresClicado, setBotaoPesquisadoresClicado] = useState(false);
  const [botaoTermosClicado, setBotaoTermosClicado] = useState(true);
  const [botaoResumoClicado, setBotaoResumoClicado] = useState(false);
  const [botaoLivrosCapitulosClicado, setBotaoLivrosCapitulosClicado] = useState(false);
  const [botaoAreasClicado, setBotaoAreasClicado] = useState(false);
  const [botaoEventosClicado, setBotaoEventosClicado] = useState(false);
  const [botaoTaxonomiaClicado, setBotaoTaxonomiaClicado] = useState(false);
  
  const [urlGeral, setUrlGeral] = useState('http://200.128.66.226:8080/');
  const [pesquisadoresSelecionadosGroupBarema, setPesquisadoresSelecionadosGroupBarema] = useState('');
  const [user, setUser] = useState<User>({} as User)
  const [isOn, setIsOn] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [intituicoesSelecionadasCheckbox, setIntituicoesSelecionadasCheckbox] = useState('');
  const [areasSelecionadasCheckbox, setAreasSelecionadasCheckbox] = useState('');

  const [valoresSelecionadosPopUp, setValoresSelecionadosPopUp] = useState('');
  const [isPopUpVisible, setIsPopUpVisible] = useState(false);
  const [idVersao, setIdVersao] = useState('4');
  const [idBarema, setIdBarema] = useState('');

  const [idGraduateProgram, setIdGraduateProgram] = useState('0');

  useEffect(() => {
  setValoresSelecionadosPopUp(valoresSelecionadosExport)
}, [valoresSelecionadosExport]);


useEffect(() => {
  const storedUser = localStorage.getItem('user');

  if (storedUser) {
    // If user information is found in local storage, set the user and mark as logged in
    setUser(JSON.parse(storedUser));
    setLoggedIn(true);
  }
}, []);

useEffect(() => {
  const storedPesquisadoresSelecionadosGroupBarema = localStorage.getItem('pesquisadoresSelecionadosGroupBarema');

  if (storedPesquisadoresSelecionadosGroupBarema) {
    // If user information is found in local storage, set the user and mark as logged in
    setPesquisadoresSelecionadosGroupBarema(JSON.parse(storedPesquisadoresSelecionadosGroupBarema));
   
  }
}, []);




  return (
    <ApolloProvider client={client} >
      <Router>
        <UserContext.Provider  
        value={{
          urlTermExport, setUrlTermExport, 
          loggedIn, setLoggedIn,
          valoresSelecionadosExport, setValoresSelecionadosExport, 
          totalPublicacoes, setTotalPublicacoes, totalPesquisadores, 
          setTotalPesquisadores, totalInstituicoes, setTotalInstituicoes, 
          valorDigitadoPesquisaDireta, setValorDigitadoPesquisaDireta,
          botaoPatentesClicado, setBotaoPatentesClicado,
          botaoPesquisadoresClicado, setBotaoPesquisadoresClicado,
          botaoTermosClicado, setBotaoTermosClicado,
          valoresSelecionadosNuvem, setValoresSelecionadosNuvem,
          botaoResumoClicado, setBotaoResumoClicado,
          botaoAreasClicado, setBotaoAreasClicado,
          botaoLivrosCapitulosClicado, setBotaoLivrosCapitulosClicado,
          botaoEventosClicado, setBotaoEventosClicado,
          botaoTaxonomiaClicado, setBotaoTaxonomiaClicado,
          urlGeral, setUrlGeral,
          idBarema, setIdBarema,
          pesquisadoresSelecionadosGroupBarema, setPesquisadoresSelecionadosGroupBarema,
          user, setUser,
          isOn, setIsOn,
          enabled, setEnabled,
          EstadoFiltro, setEstadoFiltro,
          intituicoesSelecionadasCheckbox, setIntituicoesSelecionadasCheckbox,
          areasSelecionadasCheckbox, setAreasSelecionadasCheckbox,
          filtroAreas, setFiltroAreas,

          valoresSelecionadosPopUp, setValoresSelecionadosPopUp,
          isPopUpVisible, setIsPopUpVisible,
          distinct, setDistinct,
          cidadeSelecionada, setCidadeSelecionada,

          estadoSelecionado, setEstadoSelecionado,
          
          //id versão define a versão do projeto (simcc, profnit e cimatec)
          idVersao, setIdVersao,


          idGraduateProgram, setIdGraduateProgram
          }}>
          <Routes>
            <Route path='/' >
            <Route path=':userId?' element={<PaginaInicial/>}/>
            </Route>


            <Route
        path='/meus-baremas'
        element={loggedIn ? <MeusBaremas /> : <Navigate to='/' />}
      />
            <Route path='/search' element={<StepTwo/>}/>

          

            <Route path='/admin' element={<LoginAdmin/>}/>

            <Route path='/cidades' element={<Cidades/>}/>

            <Route path='/profnit' element={<Profnit/>}/>
            <Route path='/bem-vindo' element={<HomePageSimcc/>}/>
            <Route path='/discover' element={<Discover/>}/>
           
            <Route path='/pesquisadoresSelecionados' element={<PesquisadoresPage/>}/>
           
          
            <Route
        path='/login'
        element={loggedIn == false ? <Login/> : <Navigate to='/' />}
      />

          <Route
                path='/signUp'
                element={loggedIn == false ? <SignUp/> : <Navigate to='/' />}
              />

              <Route
                  path='/dashboard'
                  element={loggedIn   ? <Admin/> : <Navigate to='/admin' />}
                />

                <Route
                  path='/minha-conta'
                  element={loggedIn && user.state != "admin"  ? <Configuracoes/> : <Navigate to='/' />}
                />

<Route
                  path='/minhas-taxonomias'
                  element={loggedIn   ? <Taxonomia/> : <Navigate to='/' />}
                />
       
            
            <Route path='/chat' element={<Chat/>}/>

            <Route path='/export-sucupira' element={<Login/>}/>
           

          

            <Route
            path='/result/:userId?'
            element={
              idGraduateProgram !== "0" ? (
                <Home />
              ) : (
                <Navigate to='/' replace state={{}} />
              )
            }
          />


            
            

            <Route path='researcher'>
              <Route path=':program/:userId?/:term?/:type?' element={<Researcher/>}/>
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

            <Route path='indicators-pos'>
              <Route path=':program?' element={<Indicators/>}/>
            </Route>

            <Route path='taxonomia'>
              <Route path=':program?' element={<Indicators/>}/>
            </Route>

            <Route path='programas-graduacao'>
              <Route path=':program?' element={<GraduationsMapPage/>}/>
            </Route>


          
            
          </Routes>
        </UserContext.Provider>
      </Router>
    </ApolloProvider>
  )
}

export default App
