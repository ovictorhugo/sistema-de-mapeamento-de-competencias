import { Link } from "react-router-dom";

import { BookOpen,  Buildings,  CaretDown, CaretUp, ChartBar, ChartLine, CheckCircle, Divide, DownloadSimple, FileCsv, GraduationCap, ListDashes, MagnifyingGlass, Minus, Plus, SignIn, Textbox, Trash, Upload, UploadSimple, UserList, UserPlus, X } from "phosphor-react";

import cimatec from '../assets/logo_profnit.png';
import { LogoWhite } from "./LogoWhite";
import { v4 as uuidv4 } from 'uuid'; // Import the uuid library
import { UserContext } from '../contexts/context'
import { useEffect, useState, useContext } from "react";
import { SvgBarema } from "./SvgBarema";
import logo_4 from '../assets/logo_4.png';
import Papa from 'papaparse';
import Cookies from 'js-cookie';
import { getFirestore, doc, getDocs, collection, addDoc, query, deleteDoc,  where,  Query } from 'firebase/firestore';
import bg_popup from '../assets/bg_popup.png';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import woman from '../assets/woman_ilus.png';
import { HeaderBarema } from "./HeaderBarema";
import { PopUpWrapper } from "./PopUpWrapper";

type Research = {
  article_A1: string,
  article_A2: string,
  article_A3: string,
  article_A4: string,
  article_B1: string,
  article_B2: string,
  article_B3: string,
  article_B4: string,
  article_C: string,
  article_SQ: string,
  book: string,
  book_chapter: string,
  brand: string,
  event_organization: string,
  graduation: string,
  guidance_d_a: string,
  guidance_d_c: string,
  guidance_e_a: string,
  guidance_e_c: string,
  guidance_g_a: string,
  guidance_g_c: string,
  guidance_ic_a: string,
  guidance_ic_c: string,
  guidance_m_a: string,
  guidance_m_c: string,
  id: string,
  lattes_10_id: string,
  participation_event: string,
  patent: string,
  researcher: string,
  software: string,
  work_in_event: string,
  university: string
  name: string

  totalArticlesPoints: number
  totalBookPoints: number
  totalChapterPoints: number
  totalDoutoradoCPoints: number
  totalMestradoCPoints: number
  totalIcCPoints: number
  totalOrganizacaoPoints: number
  totalParticipacaoPoints: number
  totalIcAPoints: number
  totalPosAPoints: number
  totalLatoSensuPoints: number
  totalWorkEventPoints: number
  totalTitulacaoPoints: number
  totalPatentePoints: number

  totalSofwareBrandPoints: number
  totalEspTccPoints: number
  TotalProducaoBibliografica: number
  TotalRecursosHumanosAndamento: number
  TotalRecursosHumanosConcluido: number
  TotalParticipacaoEventos: number
  TotalBarema: string
  TotalBaremaFormated: string

  among: number,
    articles: number,
    
    book_chapters: number,
 
    lattes_id: string,
    area: string,
  
    abstract: string
    city: string,
    orcid: string,
    image: string,
  
    lattes_update: Date,

  }

  interface Pesquisadores {
    id: string
    name: string
  }

  interface Csv {
    codigo: string
    criterio: string
    descricao: string
    ano: string
    pontos: string
    pontuacao_maxima: string
    'categoria pai': string

  }

  interface UserData {
    id: string
    name: string,
    data: any,
    ano: string,
    anoOri: string,
    qualisSelecionados: any,
    pesquisadoresSelecionadosGroupBarema: string,
    userId: string,
    researcher: any,
    createdAt:string
  }



export function Barema() {

  //variaveis
  const { pesquisadoresSelecionadosGroupBarema, setPesquisadoresSelecionadosGroupBarema } = useContext(UserContext);
  const { idVersao, setIdVersao } = useContext(UserContext);
  const { urlGeral, setUrlGeral } = useContext(UserContext);
  const [researcherSelecionados, setResearcherSelecionados] = useState<Research[]>([]); // Define o estado vazio no início
  const { idBarema, setIdBarema } = useContext(UserContext);
  const [itensSelecionados, setItensSelecionados] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [ano, setAno] = useState(4)
  const [anoOri, setAnoOri] = useState(4)
  const [data, setData] = useState<Csv[]>([]);
  const [categories, setCategories] = useState<Csv[]>([]);;
  let urlTermPesquisadoresSelecionados = `${urlGeral}/researcherName?name=${pesquisadoresSelecionadosGroupBarema}&graduate_program_id=`
  
  if(pesquisadoresSelecionadosGroupBarema == "") {
    urlTermPesquisadoresSelecionados = `${urlGeral}/researcherName?name=null&graduate_program_id=`
  }

  const [jsonData, setJsonData] = useState<any[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(urlTermPesquisadoresSelecionados, {
          mode: 'cors',
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600',
            'Content-Type': 'text/plain'
          }
        });
        const data = await response.json();
        if (data) {
          setResearcherSelecionados(data);
          setJsonData(data);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [pesquisadoresSelecionadosGroupBarema]);

    const [researcher, setResearcher] = useState<Research[]>([]); // Define o estado vazio no início
  const [isLoading, setIsLoading] = useState(false);

 
  
  const { idGraduateProgram, setIdGraduateProgram } = useContext(UserContext)
  const {loggedIn, setLoggedIn} = useContext(UserContext);
  const [pesquisaInput, setPesquisaInput] = useState('');
  const [categorySums, setCategorySums] = useState({});

  const [csvData, setCsvData] = useState<string>(''); // Variável para armazenar os itens concatenados do CSV LattesId
  

  const pesquisaInputFormatado = pesquisaInput.trim().replace(/ \s+/g, ";");
  const urlPesquisador = urlGeral + `/reasercherInitials?initials=${pesquisaInputFormatado}`

  const removerPesquisador = (pesquisador: string) => {
    const novaString = pesquisadoresSelecionadosGroupBarema
      .split(';')
      .filter((name) => name.replace(/%20|\s+/g, '') !== pesquisador.replace(/%20|\s+/g, ''))
      .join(';');
    setPesquisadoresSelecionadosGroupBarema(novaString);

  };

  const apagarGroup = () => {
    setPesquisadoresSelecionadosGroupBarema('');
  }


  const anoAtual = new Date().getFullYear();
  const anoFiltro = anoAtual - ano;


  let urlTermPesquisadores = `${urlGeral}/resarcher_barema?name=${pesquisadoresSelecionadosGroupBarema}&lattes_id=${csvData}&yarticle=2018&ywork_event=2018&ybook=1900&ychapter_book=1900&ypatent=1900&ysoftware=1900&ybrand=1900&yresource_progress=1900&yresource_completed=1900&yparticipation_events=1900`
  

  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(urlTermPesquisadores, {
          mode: 'cors',
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600',
            'Content-Type': 'text/plain'
          }
        });
        const data = await response.json();
        if (data) {
          setResearcher(data);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [urlTermPesquisadores]);

  const [resultadosPesquisadores, setResultadosPesquisadores] = useState<Pesquisadores[]>([]);

  useEffect(() => {
  fetch(urlPesquisador, {
    mode: 'cors',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '3600',
      'Content-Type': 'text/plain'


    }
  })

    .then((response) => response.json())
    .then((data) => {
      ;
      const newDataPesquisadores = data.map((post: Pesquisadores) => ({
        ...post,
        name: post.name.replace(/\s+/g, "%20")
      }));
      setResultadosPesquisadores([]);
      setResultadosPesquisadores(newDataPesquisadores);

    })
    .catch((err) => {
      console.log(err.message);
    });

  }, [urlPesquisador]);


  //pesquisa de pesquisadores

  const [searchState, setSearchState] = useState(false)
 
  const { valorDigitadoPesquisaDireta, setValorDigitadoPesquisaDireta } = useContext(UserContext);

  function handlePesquisaChange(event: React.ChangeEvent<HTMLInputElement>) {
    const valorDigitado = event.target.value;
    setPesquisaInput(valorDigitado);
  }

  //checkboxx pesquisadores

  const handleClickPesquisadores = (name: string) => {
    setPesquisaInput('')
    setResultadosPesquisadores([])
    setPesquisadoresSelecionadosGroupBarema(pesquisadoresSelecionadosGroupBarema + ';' + name)
  };

  const [pesquisadoresSelecionados, setPesquisadoresSelecionados] = useState<string[]>([]);

  const handleCheckboxChangeInputPesquisadores = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = event.target;
    const isChecked = event.target.checked;

    setPesquisadoresSelecionados((prevSelecionados) => {
      if (isChecked) {
        return [...prevSelecionados, name];
      } else {
        return prevSelecionados.filter((item) => item !== name);
      }
    });
  };

  
 

  const checkboxPesquisadores = resultadosPesquisadores.map((resultado) => (
    <li
      key={resultado.id}
      className="checkboxLabel group list-none inline-flex  group overflow-hidden"
      onMouseDown={(e) => e.preventDefault()}
    >
      <label className="group-checked:bg-blue-400 whitespace-nowrap cursor-pointer border-[1px]  border-white transition-all flex h-10 items-center px-4 text-white rounded-md text-xs font-bold hover:border-blue-400 hover:bg-white hover:text-blue-400">
        <span className="text-center block">{resultado.name.replace(/%20/g, ' ')}</span>
        <input
          type="checkbox"
          name={resultado.name}
          className="absolute hidden group"
          checked={pesquisadoresSelecionados.includes(resultado.name)}
          id={resultado.name}
          onChange={handleCheckboxChangeInputPesquisadores}
          onClick={() => handleClickPesquisadores(resultado.name)}
         
        />
      </label>
    </li>
  ));


  //FIREBASEE

  const { user, setUser } = useContext(UserContext);
  const userId = user && user.uid;
  const [userData, setUserData] = useState<UserData[] | null>(null);
  const db = getFirestore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userId) {
          console.log('userId:', userId);
  
          const userDocsRef = collection(db, 'baremas');
const userDocsQuery = query(userDocsRef, where('userId', '==', userId));
const userDocSnapshot = await getDocs(userDocsQuery);
  
          console.log('userDocSnapshot:', userDocSnapshot);
  
          if (userDocSnapshot.size > 0) {
           
            
            const userDataArray = userDocSnapshot.docs.map((doc) => doc.data() as UserData);
setUserData(userDataArray);

console.log('User Data:', userData);
          } else {
            console.log('User data not found');
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    fetchData();
  }, [db, userId]);

  
  useEffect(() => {
    // Check if idBarema matches the id of any user in userData
    const matchingUser = userData?.find((user) => user.id === idBarema);

    if (matchingUser) {
      // Set the data state to the data property of the matching user
      setData(matchingUser.data);
      setName(matchingUser.name)
      setAno(Number(matchingUser.ano))
      setAnoOri(Number(matchingUser.anoOri))
      setItensSelecionados(matchingUser.qualisSelecionados.split(";"))

     
    } else {
      // Handle the case where no matching user is found
      // You might want to set data to an empty array or handle it differently
      setData([]);
    }
  }, [idBarema, userData]);

  useEffect(() => {
    // Check if userData is not null and if data has been set
    if (userData && data.length > 0) {
      // Map the data to retrieve all rows where "categoria pai" is an empty string or "0"
      const parentCategories = data.map((row: any) => {
        if (row['categoria pai'] === '' || row['categoria pai'] === '0') {
          return row;
        }
        return null; // If the condition is not met, return null
      }).filter(Boolean); // Filter out the null values

      setCategories(parentCategories);
    }
  }, [userData, data]);

   
  useEffect(() => {
    const storedPesquisadoresSelecionadosGroupBarema = localStorage.getItem('pesquisadoresSelecionadosGroupBarema');
  
    if (storedPesquisadoresSelecionadosGroupBarema && userData && userData.length === 0) {
      // If user information is found in local storage, set the user and mark as logged in
      setPesquisadoresSelecionadosGroupBarema(JSON.parse(storedPesquisadoresSelecionadosGroupBarema));
     
    }
  }, [userData]);

  console.log(urlTermPesquisadoresSelecionados)

 


  //upload de arquivos

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null; // Use null como fallback
    setSelectedFile(file);
  };

  function handleClick() {
    setValorDigitadoPesquisaDireta(pesquisaInput.replace(/\s+/g, ";"));
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      // Realize a ação de pesquisa aqui, por exemplo, chame uma função de pesquisa
      handleClick();
    }
  };

 

  

  const handleFileUpload = (e: any) => {
    const file = e.target.files[0];

    if (file) {
      setIsPopUp(false);

      Papa.parse(file, {
        complete: (result: any) => {
          const parsedData = result.data;
        

          setData(parsedData);

         // Filter categories with 'categoria pai' equal to 0
        const parentCategories = parsedData.filter((row: any) => row['categoria pai'] === '0');
       

        setCategories(parentCategories);


        },
        header: true,
        skipEmptyLines: true,
        delimiter: ";",
        encoding: "UTF-8",
      });
    }
  };


  useEffect(() => {
    // Perform data processing when both data and categories are ready
    if (data.length > 0 && categories.length > 0) {
      const processedResearchers = processResearchers(researcher, data);
      setResearcher(processedResearchers);
    }
  }, [researcher]);


  useEffect(() => {
    // Perform data processing when both data and categories are ready
    if (data.length > 0 && categories.length > 0) {
      const processedResearchers = processResearchers(researcher, data);
      setResearcher(processedResearchers);
    }
  }, [data]);

  //calcular

  const processResearchers = (researchersData: Research[], categories: any) => {
    return researchersData.map((props) => {
      // Encontre os valores correspondentes no CSV
      const articlesCategory = categories.find((category: any) => category.codigo === "6");
      const booksCategory = categories.find((category: any) => category.codigo === "7");
      const chaptersCategory = categories.find((category: any) => category.codigo === "8");
      const posACategory = categories.find((category: any) => category.codigo === "10");
      const icACategory = categories.find((category: any) => category.codigo === "11");
      const doutoradoCCategory = categories.find((category: any) => category.codigo === "13");
      const mestradoCCategory = categories.find((category: any) => category.codigo === "14");
      const latoSensuCategory = categories.find((category: any) => category.codigo === "15");
      const icCCategory = categories.find((category: any) => category.codigo === "16");
      const organizacaoCategory = categories.find((category: any) => category.codigo === "18");
      const participacaoCategory = categories.find((category: any) => category.codigo === "19");
      const workEventCategory = categories.find((category: any) => category.codigo === "20");

      const softwareBrandCategory = categories.find((category: any) => category.codigo === "23");
      const espTccCategory = categories.find((category: any) => category.codigo === "25");
     

      const posDocCategory = categories.find((category: any) => category.codigo === "2");
      const docCategory = categories.find((category: any) => category.codigo === "3");
      const mestCategory = categories.find((category: any) => category.codigo === "4");
      const especCategory = categories.find((category: any) => category.codigo === "21");
      const patenteCategory = categories.find((category: any) => category.codigo === "22");

      // Calcula os pontos para cada categoria
      const articlesPoints = parseFloat(articlesCategory?.pontos || "0");
      const booksPoints = parseFloat(booksCategory?.pontos || "0");
      const chaptersPoints = parseFloat(chaptersCategory?.pontos || "0");
      const posAPoints = parseFloat(posACategory?.pontos || "0");
      const icAPoints = parseFloat(icACategory?.pontos || "0");
      const doutoradoCPoints = parseFloat(doutoradoCCategory?.pontos || "0");
      const mestradoCPoints = parseFloat(mestradoCCategory?.pontos || "0");
      const icCPoints = parseFloat(icCCategory?.pontos || "0");
      const organizacaoPoints = parseFloat(organizacaoCategory?.pontos || "0");
      const participacaoPoints = parseFloat(participacaoCategory?.pontos || "0");
      const latoSensuPoints = parseFloat(latoSensuCategory?.pontos || "0");
      const workEventPoints = parseFloat(workEventCategory?.pontos || "0");

      const softwareBrandPoints = parseFloat(softwareBrandCategory?.pontos || "0");
      const espTccPoints = parseFloat(espTccCategory?.pontos || "0");
     

      const posDocPoints = parseFloat(posDocCategory?.pontos || "0");
      const docPoints = parseFloat(docCategory?.pontos || "0");
      const mestPoints = parseFloat(mestCategory?.pontos || "0");
      const especPoints = parseFloat(especCategory?.pontos || "0");
      const patentePoints = parseFloat(patenteCategory?.pontos || "0");

      //titulacao

      let totalTitulacaoPoints = 0

      if(props.graduation == "Pós-Doutorado") {
        totalTitulacaoPoints = posDocPoints
      }

      if(props.graduation == "Doutorado") {
        totalTitulacaoPoints = docPoints
      }

      if(props.graduation == "Mestrado") {
        totalTitulacaoPoints = mestPoints
      }

      if(props.graduation == "Especialização") {
        totalTitulacaoPoints = especPoints
      }

      
      
      let totalArticlesPoints

      const selectedArticlesPoints = qualis
    .filter((q) => itensSelecionados.includes(q.itens))
    .map((q) => articlesPoints * parseFloat(props['article_' + q.itens as keyof Research] as any || "0"))
    .reduce((total, articlePoints) => total + articlePoints, 0);


    if (selectedArticlesPoints > parseFloat(articlesCategory?.pontuacao_maxima || "0")) {
      totalArticlesPoints = parseFloat(articlesCategory?.pontuacao_maxima || "0");
    } else {
      totalArticlesPoints = selectedArticlesPoints;
    }

    // SOFFTWARE E MARCA
    let totalSofwareBrandPoints = (softwareBrandPoints * parseFloat(props.software || "0")) + (softwareBrandPoints * parseFloat(props.brand || "0"));
    if (totalSofwareBrandPoints > parseFloat(softwareBrandCategory?.pontuacao_maxima || "0")) {
      totalSofwareBrandPoints = parseFloat(softwareBrandCategory?.pontuacao_maxima || "0");
    }

    // Outros (Especia e TCC)
    let totalEspTccPoints = (espTccPoints * parseFloat(props.guidance_g_c || "0")) + (espTccPoints * parseFloat(props.guidance_e_c || "0"));
    if (totalEspTccPoints > parseFloat(espTccCategory?.pontuacao_maxima || "0")) {
      totalEspTccPoints = parseFloat(espTccCategory?.pontuacao_maxima || "0");
    }

    // patente
    let totalPatentePoints = (patentePoints * parseFloat(props.patent|| "0")) 
    if (totalPatentePoints > parseFloat(patenteCategory?.pontuacao_maxima || "0")) {
      totalPatentePoints = parseFloat(patenteCategory?.pontuacao_maxima || "0");
    }
      
      // LIVRO
      let totalBookPoints = booksPoints * parseFloat(props.book || "0");
      if (totalBookPoints > parseFloat(booksCategory?.pontuacao_maxima || "0")) {
        totalBookPoints = parseFloat(booksCategory?.pontuacao_maxima || "0");
      }

      // CAPÍTULO DE LIVRO
      let totalChapterPoints = chaptersPoints * parseFloat(props.book_chapter || "0");
      if (totalChapterPoints > parseFloat(chaptersCategory?.pontuacao_maxima || "0")) {
        totalChapterPoints = parseFloat(chaptersCategory?.pontuacao_maxima || "0");
      }

      //Orientações em andamento - pos
      let totalPosAPoints = (posAPoints * parseFloat(props.guidance_m_a || "0")) + (posAPoints * parseFloat(props.guidance_d_a || "0"));
      if (totalPosAPoints > parseFloat(posACategory?.pontuacao_maxima || "0")) {
        totalPosAPoints = parseFloat(posACategory?.pontuacao_maxima || "0");
      }

      //Orientações em andamento - ic
      let totalIcAPoints = icAPoints * parseFloat(props.guidance_ic_a || "0");
      if (totalIcAPoints > parseFloat(icACategory?.pontuacao_maxima || "0")) {
        totalIcAPoints = parseFloat(icACategory?.pontuacao_maxima || "0");
      }

      //Orientações concluidas - doutorado
      let totalDoutoradoCPoints = doutoradoCPoints * parseFloat(props.guidance_d_c || "0");
      if (totalDoutoradoCPoints > parseFloat(doutoradoCCategory?.pontuacao_maxima || "0")) {
        totalDoutoradoCPoints = parseFloat(doutoradoCCategory?.pontuacao_maxima || "0");
      }

       //Orientações concluidas - mestrado
       let totalMestradoCPoints = mestradoCPoints * parseFloat(props.guidance_m_c || "0");
       if (totalMestradoCPoints > parseFloat(mestradoCCategory?.pontuacao_maxima || "0")) {
        totalMestradoCPoints = parseFloat(mestradoCCategory?.pontuacao_maxima || "0");
       }

       //Orientações concluidas - lato sensu
       let totalLatoSensuPoints = latoSensuPoints * parseFloat(props.guidance_e_c || "0");
       if (totalLatoSensuPoints > parseFloat(latoSensuCategory?.pontuacao_maxima || "0")) {
        totalLatoSensuPoints = parseFloat(latoSensuCategory?.pontuacao_maxima || "0");
       }


       //Orientações concluidas - ic
       let totalIcCPoints = icCPoints * parseFloat(props.guidance_ic_c || "0");
       if (totalIcCPoints > parseFloat(icCCategory?.pontuacao_maxima || "0")) {
        totalIcCPoints = parseFloat(icCCategory?.pontuacao_maxima || "0");
       }

       //Organização
       let totalOrganizacaoPoints = organizacaoPoints * parseFloat(props.event_organization || "0");
       if (totalOrganizacaoPoints > parseFloat(organizacaoCategory?.pontuacao_maxima || "0")) {
        totalOrganizacaoPoints = parseFloat(organizacaoCategory?.pontuacao_maxima || "0");
       }

        //participação
        let totalParticipacaoPoints = participacaoPoints * parseFloat(props.participation_event || "0");
        if (totalParticipacaoPoints > parseFloat(participacaoCategory?.pontuacao_maxima || "0")) {
          totalParticipacaoPoints = parseFloat(participacaoCategory?.pontuacao_maxima || "0");
        }

        //Work Event
        let totalWorkEventPoints = workEventPoints * parseFloat(props.work_in_event || "0");
        if (totalWorkEventPoints > parseFloat(workEventCategory?.pontuacao_maxima || "0")) {
          totalWorkEventPoints = parseFloat(workEventCategory?.pontuacao_maxima || "0");
        }


        let TotalProducaoBibliografica = Number((totalArticlesPoints + totalBookPoints + totalChapterPoints + totalWorkEventPoints + totalPatentePoints + totalSofwareBrandPoints).toFixed(2))
        let TotalRecursosHumanosAndamento = Number((totalPosAPoints +  totalIcAPoints).toFixed(2))
        let TotalParticipacaoEventos = Number((totalOrganizacaoPoints + totalParticipacaoPoints).toFixed(2))
        let TotalRecursosHumanosConcluido = Number((totalDoutoradoCPoints + totalMestradoCPoints + totalIcCPoints + totalEspTccPoints + Number(TotalParticipacaoEventos)).toFixed(2))
        
        
        let TotalBarema = Number(TotalProducaoBibliografica + TotalRecursosHumanosAndamento + TotalRecursosHumanosConcluido  + totalTitulacaoPoints).toFixed(2)

        let TotalBaremaFormated = String(TotalBarema).replace(/\./g, ",");


      
      // Crie um novo objeto Research com os resultados das operações
      return {
        ...props,
        totalArticlesPoints,
        totalBookPoints,
        totalChapterPoints,
        totalDoutoradoCPoints,
        totalMestradoCPoints,
        totalIcCPoints,
        totalOrganizacaoPoints,
        totalParticipacaoPoints,
        totalIcAPoints,
        totalPosAPoints,
        totalLatoSensuPoints,
        totalWorkEventPoints,
        totalTitulacaoPoints,
        totalSofwareBrandPoints,
        totalEspTccPoints,
        totalPatentePoints,

        TotalProducaoBibliografica,
        TotalRecursosHumanosAndamento,
        TotalRecursosHumanosConcluido,
        TotalParticipacaoEventos,
        TotalBarema,
        TotalBaremaFormated

      };
    });
  };

  // Copie sua matriz researcher para uma nova variável para não modificar a original
  const sortedResearcher = [...researcher];

  // Classifique a matriz em ordem decrescente com base em TotalBarema
  sortedResearcher.sort((a, b) => Number(b.TotalBarema) - Number(a.TotalBarema));
  

  
  //baixar dados

  const generateCSVContent = () => {
    // Define the headers for the CSV file.
    const headers = [
      'researcher',

      'totalTitulacaoPoints',

      'totalArticlesPoints',
      'totalWorkEventPoints',
      'totalBookPoints',
      'totalChapterPoints',
      'totalPatentePoints',
      'totalSofwareBrandPoints',
      'Projetos de Pesquisa',
      'TotalProducaoBibliografica',

      


      'totalPosAPoints',
      'totalIcAPoints',
      'TotalRecursosHumanosAndamento',

      'totalDoutoradoCPoints',
      'totalMestradoCPoints',
      'totalIcCPoints',
      'totalEspTccPoints',
      'totalOrganizacaoPoints',
      'totalParticipacaoPoints',
      
      'TotalRecursosHumanosConcluido',
      
      
      'TotalBaremaFormated',
    ];

    // Create the CSV content as a string.
    const csvContent = [
      headers.join(';'),
      ...sortedResearcher.map((research) => {
        return headers.map((header) => {
          if (header === 'researcher') {
            // Decode the URL-encoded value for the 'codigo' field
            return decodeURIComponent(research[header]).replace(/%20/g, ' ');
          }
          return research[header as keyof Research] as any;
        }).join(';');
      }),
    ].join('\n');

  return csvContent;
  };

  const downloadCSV = () => {
    const csvContent = generateCSVContent();

    // Create a Blob containing the CSV data.
    
    const blob = new Blob([csvContent], { type: 'data:text/csv;charset=utf-8' }); // Specify UTF-8
    // Create a download link and trigger the download.
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'research_data.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

 

  //visibilidade

  const [isCloseHidden, setIsCloseHidden] = useState(false); //Produção geral
  const [isPopUp, setIsPopUp] = useState(true);

  const handleFileInputChange = (event: any) => {
    // Check if a file is selected
    if (event.target.files.length > 0) {
      setIsPopUp(false); // Set isPopUp to false when a file is selected
    }
  };


  //checkbox quallis

    const [qualis, setQualis] = useState([
    { id: 1, itens: 'A1' },
    { id: 2, itens: 'A2' },
    { id: 3, itens: 'A3' },
    { id: 4, itens: 'A4' },
    { id: 5, itens: 'B1' },
    { id: 6, itens: 'B2' },
    { id: 7, itens: 'B3' },
    { id: 8, itens: 'B4' },
    { id: 10, itens: 'C' },
    { id: 11, itens: 'SQ' },
  ]);



  const qualisColor: { [key: string]: string } = {
    'A1': 'bg-[#006837]',
    'A2': 'bg-[#8FC53E]',
    'A3': 'bg-[#ACC483]',
    'A4': 'bg-[#BDC4B1]',
    'B1': 'bg-[#F15A24]',
    'B2': 'bg-[#F5831F]',
    'B3': 'bg-[#F4AD78]',
    'B4': 'bg-[#F4A992]',
    'C': 'bg-[#EC1C22]',
    'SQ': 'bg-[#560B11]',
  }

  

  type CheckboxStates = {
    [index: number]: boolean;
  };

  const [checkboxStates, setCheckboxStates] = useState<CheckboxStates>({});

  const handleCheckboxChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const itemId = event.target.name;
    const isChecked = event.target.checked;

    setCheckboxStates((prevStates) => ({ ...prevStates, [itemId]: isChecked }));

    setItensSelecionados((prevSelecionados) => {
      const selectedQualis = qualis.find((q) => q.id === parseInt(itemId));
      if (selectedQualis) {
        if (isChecked) {
          return [...prevSelecionados, selectedQualis.itens];
        } else {
          return prevSelecionados.filter((item) => item !== selectedQualis.itens);
        }
      } else {
        // handle the case where selectedQualis is undefined
        return prevSelecionados;
      }
    });
  };

  const [qualisSelecionados, setQualisSelecionados ] = useState(``)
  useEffect(() => {
  setQualisSelecionados(String(itensSelecionados.join(';')))
}, [itensSelecionados]);

  const checkboxQualis = qualis.map((quali) => {
    const isChecked = checkboxStates[quali.id];
    return (
      <li
        key={quali.id}
        className="checkboxLabel group list-none inline-flex  group overflow-hidden"
        onMouseDown={(e) => e.preventDefault()}
      >
        <label
          className={`group-checked:bg-blue-400 cursor-pointer border-[1px] gap-3 bg-white border-gray-300 flex h-10 items-center px-4 text-gray-400 rounded-lg text-xs font-bold hover:border-blue-400 hover:bg-blue-100 ${isChecked ? 'activeTab' : ''}`}
        >
          <div className={`rounded-sm h-4 w-4 ${qualisColor[quali.itens]}`}></div>
          <span className="text-center block">{quali.itens}</span>
          <input
            type="checkbox"
            name={quali.id.toString()}
            className="absolute hidden group"
            onChange={handleCheckboxChangeInput}
            id={quali.itens}
            checked={isChecked}
          />
        </label>
      </li>
    );
  });
  
//gráfico

const options: Highcharts.Options = {
  chart: {
    type: 'column',
  },
  title: {
    text: '',
  },
  xAxis: {
    categories: sortedResearcher.map((researcher) => researcher.researcher),
    title: {
      text: 'Pesquisador',
    },
  },
  credits: {
    enabled: false,
  },
  yAxis: {
    title: {
      text: 'Pontuação Total',
    },
  },
  series: [
    {
      name: 'Pontuação Total',
      data: sortedResearcher.map((researcher: any) => Number(researcher.TotalBarema)),
      type: 'column', 
      color: '#173DFF'
    },
  ],
};


/// importar dados LATTES 10 ID


const handleFileInputChangeLattesId = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];

  if (file) {
    Papa.parse(file, {
      complete: (result: any) => {
        // Result.data é uma matriz com os dados do CSV
        const csvItems = result.data.map((row: any) => row['id_lattes']); // Supondo que o CSV tenha apenas uma coluna
        const uniqueItems = Array.from(new Set(csvItems.filter((item: string) => item !== ""))); // Remover itens iguais
        const concatenatedItems = uniqueItems.join(';'); // Concatenar os itens únicos com ';'
        setCsvData(concatenatedItems);
      },
      header: true, // Se o CSV tiver um cabeçalho
    });
  }
};




  //popup

  



  const [popUpProgram, setPopUpProgram] = useState(false);
  const [popUpSuccess, setPopUpSuccess] = useState(false);

  const createdAt = new Date().toISOString()

  const handleSubmit = async () => {
    try {
      // Aqui você pode adicionar a lógica para tratar os tipos de programa selecionados
      // programTypes é um array com os tipos selecionados
      const docId = uuidv4();
      // Crie um objeto com os dados do formulário
      const formData = {
        id: docId,
        name,
        data,
        ano,
        anoOri,
        qualisSelecionados,
        pesquisadoresSelecionadosGroupBarema,
        userId,
        researcher,
        createdAt
        
      };
  
      // Submeta os dados para o Firestore
      const db = getFirestore();
      const programRef = collection(db, 'baremas');
      await addDoc(programRef, formData);
  
      // Limpe os campos do formulário após a submissão
      setName('');
      setAno(4)
      setAnoOri(4)
  
      // Feche o pop-up ou faça qualquer outra ação necessária
      setPopUpProgram(false);

      setTimeout(() => {
        setPopUpSuccess(true);

        // Hide the popup after 5 seconds
        setTimeout(() => {
          setPopUpSuccess(false);
        }, 5000);
      }, 0);
    } catch (error) {
      console.error('Erro ao enviar os dados:', error);
    }
  };

  const handleClickAdicionarBtn = () => {
  
        setPopUpProgram(true)
    

  };

console.log(`idBarema`, idBarema)
    return  (
        <div className=" min-h-screen ">

    <div className="absolute  w-full top-0 left-0 ">
                <div className="w-full  h-[50vh] bg-blue-400   " >
                  <div className="w-full h-full bg-cover opacity-20 " style={{ backgroundImage: `url(${bg_popup})` }}>

                  </div>
                </div>
            </div>

          <div className="backgroundGradient h-full w-full md:px-16 px-6 pb-16">
            

            {isPopUp == true && data.length === 0 ? (
              <div className="fixed px-16 top-0 left-0 h-screen w-full bg-blue-400 z-[9999] bg-opacity-60 backdrop-blur-md">
              <div className="w-full grid grid-cols-2 gap-2 h-creen items-center">
                <div className="flex justify-center h-screen gap-4 flex-col">

                <h1 className="text-4xl mb-4 font-normal max-w-[400px] text-white pt-12 ">

                <strong className="bg-red-400 text-white font-normal">
                Barema 
                </strong>{" "}
                de avaliação dos pesquisadores
                </h1>
                <div className="gap-4 flex">
                <label htmlFor="fileInput" onChange={handleFileUpload} className="rounded-xl cursor-pointer px-4 h-12 border-white border flex items-center justify-center gap-3 hover:bg-white transition-all text-white hover:text-blue-400">
    <input onChange={handleFileUpload} id="fileInput" type="file" accept=".csv"  hidden />
    <UploadSimple size={16} className="" />
    Importar arquivo .csv com barema
  </label>
                <a href="/public/modelo_barema.csv" download className="rounded-xl cursor-pointer  h-12 px-4 border-white border flex items-center justify-center hover:bg-white transition-all gap-3 text-white hover:text-blue-400"><FileCsv size={16} className="" />Download modelo csv</a></div>
                </div>

                <div className="flex flex-col gap-8">
                  <div className="flex gap-4 items-center">
                    <div className="rounded-full   opacity-20 border-white h-32 min-w-[128px] border-4 flex items-center justify-center text-white font-medium text-5xl"> 1</div>
                    <div><h4 className="text-white text-2xl  mb-2">Primeiro passo</h4><p className="text-white text-md">Baixe o modelo de arquivo .csv disponibilizado no site e defina os critérios de avaliação, assim como sua pontuação e quantidade máxima. Você pode remover os critérios pré-existentes</p></div>
                  </div>

                  <div className="flex gap-4 items-center">
                    <div className="rounded-full opacity-60 border-white h-32 min-w-[128px] border-4 flex items-center justify-center text-white font-medium text-5xl"> 2</div>
                    <div><h4 className="text-white text-2xl mb-2">Segundo passo</h4><p className="text-white text-md">Importe o arquivo modificado no site, certifique-se de que se encontra no formato UTF-8 e separado por ( ; ) ponto e vírgula</p></div>
                  </div>

                  <div className="flex gap-4 items-center">
                    <div className="rounded-full border-white h-32 min-w-[128px] border-4 flex items-center justify-center text-white font-medium text-5xl"> 3</div>
                    <div><h4 className="text-white text-2xl mb-2">Terceiro passo</h4><p className="text-white text-md">Com os parâmetros definidos, você pode importar os pesquisadores direto da plataforma, importando um arquivo .csv com o Id Lattes ou pelo .xml do docente</p></div>
                  </div>
                </div>
              </div>
            </div>
            ):('')}

            <HeaderBarema/>

           <div className="">

           <div className="flex justify-between gap-4 items-center ">
            <div className="mb-[20px] z-[99]">
                <h1 className="z-[999999] text-4xl mb-4 font-normal max-w-[750px] text-white pt-12 ">

                <strong className="bg-red-400 text-white font-normal">
                Barema 
                </strong>{" "}
                de avaliação dos pesquisadores
                </h1>
                
                <p className="text-white max-w-[750px] pb-8">O sistema de classificação, é uma estrutura criada para avaliar e classificar pesquisadores com base em critérios específicos como qualidade e quantidade de publicações, impacto da pesquisa, contribuições para a comunidade científica, atividades de ensino e entre outros.</p>
                
                <div className="flex gap-3 mb-3" >
                {researcher.slice(0,8).map(props => {
                    
                      return(
                        <div key={props.id} className="group flex transition-all">
                            <Link to={`/researcher/${props.id}`} target="_blank" className=" rounded-lg w-12 h-12 bg-cover bg-center bg-no-repeat group-hover:rounded-l-lg group-hover:rounded-r-none" style={{ backgroundImage: `url(http://servicosweb.cnpq.br/wspessoa/servletrecuperafoto?tipo=1&id=${props.lattes_10_id}) ` }}></Link>
                            <div onClick={() => removerPesquisador(props.name)} className="h-12 w-12 bg-white hidden group-hover:flex items-center justify-center transition-all text-blue-400 rounded-r-lg cursor-pointer" ><X size={16} className="" /></div>
                        </div>
                    )
                    
                })}
                    <div onClick={() => setSearchState(!searchState)} className={`rounded-xl w-12 h-12 cursor-pointer  border-white border flex items-center justify-center hover:bg-white transition-all  hover:text-blue-400 ${searchState == true ? ('bg-white text-blue-400'): ('text-white')}`}>{searchState == false ? (<Plus size={16} className="" />):(<X size={16} className="" />)}</div>

                    {searchState == true ? (
                  <div>
                    <div className={`flex  items-center h-12 group w-full  text-base font-medium  justify-center transition border-[1px] border-white rounded-lg `}>
                  <MagnifyingGlass size={20} className={` min-w-[52px] text-white`} />
                  
                  <input
                    type="text"
                    value={pesquisaInput}
                    onChange={handlePesquisaChange}
          
                    onKeyPress={handleKeyPress}
                    name=""
                    placeholder="Digite o nome do pesquisador"
                    id="" 
                    className="placeholder-white::placeholder w-full h-full outline-none rounded-xl bg-blue-400 text-white" />
                </div>

               
                  </div>
                ): ('')}

                {pesquisadoresSelecionadosGroupBarema != '' ? (
                  <div onClick={() => apagarGroup()}  className="rounded-xl cursor-pointer w-12 h-12  border-white border flex items-center justify-center hover:bg-white transition-all text-white hover:text-blue-400"><Trash size={16} className="" /></div>
                ): ('') }

                <div className="text-white font-medium h-12 w-12 flex items-center justify-center">ou</div>
                   
                <form action="">
                    <label htmlFor="uploadxml"  className="rounded-xl cursor-pointer px-4 h-12 border-white border flex items-center justify-center gap-3 hover:bg-white transition-all text-white hover:text-blue-400"><input id="uploadxml" type="file" accept=".xml" hidden className=""/><DownloadSimple size={16} className="" />Importar arquivo xml do pesquisador</label>
                    </form>

                </div>

                

                {searchState == true && pesquisaInput != "" ? (
                  <div className="h-10 overflow-x-auto elementBarra relative max-w-[750px]">
                    <div className="w-full flex  gap-4  overflow-x-auto ">{checkboxPesquisadores}</div>
                  </div>
                ): ('')}
            </div>

            <div >
            
            </div>

            
           </div>

           
           {/*teste*/}

           <div>
      
      
          <div className=" relative">
      <div  className=" flex flex-col gap-8 w-full  p-12 mb-12 bg-white border border-gray-300 rounded-2xl" >
      <div >
      <h1 className=" text-2xl mb-2 font-normal max-w-[750px] ">
                <strong className="bg-red-400 text-white font-normal">Configurações</strong> da avaliação {name}
              </h1>
              <p className="text-gray-400 max-w-[750px]">Estas configurações incluem o nome do barema para exportação, o período de ano a ser considerado para a análise, a importação de um arquivo CSV contendo os critérios de avaliação e as classificações Qualis atribuídas a cada publicação</p>
      </div>

              <div className="flex gap-4 items-center">
                <p className="text-gray-400  flex items-center gap-2">
                Nome do barema:
              <input
                  type="text"
                  min="0" max="100"
                  className="hover:border-blue-400 transition-all border-[1px] min-w-[350px]  bg-white  border-gray-300 flex h-12 items-center px-4 text-gray-400 rounded-xl text-xs font-bold  outline-none"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  
                />
                </p>

                <label htmlFor="fileInput" onChange={handleFileInputChange} className="rounded-xl w-fit cursor-pointer hover:bg-blue-100 px-4 h-12 border-gray-300 border flex items-center justify-center gap-3 hover:border-blue-400 transition-all text-gray-400 hover:text-blue-400"><input id="fileInput" type="file" accept=".csv" hidden/><DownloadSimple size={16} className="" />Importar arquivo .csv com barema</label>
              <label htmlFor="fileInputLattesId"  className="rounded-xl w-fit cursor-pointer hover:bg-blue-100 px-4 h-12 border-gray-300 border flex items-center justify-center gap-3 hover:border-blue-400 transition-all text-gray-400 hover:text-blue-400"><input  id="fileInputLattesId" type="file" onChange={handleFileInputChangeLattesId} accept=".csv" hidden/><UserPlus size={16} className="" />Importar arquivo .csv com Id Lattes</label>
              </div>

              <div className="flex gap-8">
                <p className="text-gray-400  flex items-center gap-2">
                Será considerada APENAS as orientações em andamento e concluidas dos últimos
              <input
                  type="number"
                  min="0" max="100"
                  className="hover:border-blue-400 transition-all border-[1px] w-12 bg-white border-gray-300 flex h-10 items-center px-4 text-gray-400 rounded-md text-xs font-bold  outline-none"
                  value={anoOri}
                  onChange={(e) => setAnoOri(parseInt(e.target.value))}
                  
                />
                anos
                </p>

                <div className="w-[1px] bg-gray-300 h-12"></div>

              <p className="text-gray-400  flex items-center gap-2">
                Será considerada APENAS a produção dos últimos
              <input
                  type="number"
                  min="0" max="100"
                  className="hover:border-blue-400 transition-all border-[1px] w-12 bg-white border-gray-300 flex h-10 items-center px-4 text-gray-400 rounded-md text-xs font-bold  outline-none"
                  value={ano}
                  onChange={(e) => setAno(parseInt(e.target.value))}
                />
                anos
                </p>
              </div>
                <div className="flex gap-4 items-center">
                        <p className="text-gray-400  whitespace-nowrap">Selecione os qualis desejados</p>
                        <div className="gap-4 flex flex-wrap ">
                          {checkboxQualis}
                        </div>
                      </div>
      </div>
      </div>

      {/* Renderização dos blocos por categoria */}
     {/*fazer um map das categorias*/}

     {categories.map((parentCategory) => (
    <div className="mb-12" key={parentCategory.codigo}>
      <div className="z-[-999999] flex flex-col gap-4 w-full p-12 bg-white border border-gray-300 rounded-t-2xl">
        {/* Título da categoria */}
        <div className="flex justify-between">
          <div>
            <h1 className="z-[999999] text-2xl mb-2 font-normal max-w-[750px]">
              <strong className="bg-red-400 text-white font-normal">
                {parentCategory.criterio}
              </strong>
            </h1>
            {parentCategory.descricao != '' ? (
              <p className="text-gray-400 mb-8">{parentCategory.descricao}</p>
            ):('')}
          </div>
          <div
            onClick={() => setIsCloseHidden(!isCloseHidden)}
            className="button-to-toggle z-[999] text-gray-400 cursor-pointer rounded-full hover:bg-gray-100 h-[38px] w-[38px] transition-all flex items-center justify-center"
          >
            {isCloseHidden === false ? (
              <CaretUp size={16} className="" />
            ) : (
              <CaretDown size={16} className="" />
            )}
          </div>
        </div>

        {/* Tabela para exibir os dados da categoria */}
        <div className={isCloseHidden ? 'hidden' : ''}>
          <div className="w-full grid grid-cols-4 mb-4">
            <p className="text-gray-400">Critérios</p>
            <p className="text-gray-400">Pontos</p>
            <p className="text-gray-400">Pontuação máxima</p>
            <p className="text-gray-400">Total</p>
          </div>

          <div className="w-full flex gap-4 flex-col">
          {data
              .filter((row) => row['categoria pai'] !== "0" && row['categoria pai'] === parentCategory.codigo)
              .map((subCategory) => (
              <div key={subCategory.codigo} className="grid grid-cols-4 gap-4 border-t pt-4 border-gray-300">
                <div className="border-[1px] bg-white border-gray-300 flex h-10 items-center px-4 text-gray-400 rounded-lg text-xs font-bold w-fit truncate overflow-ellipsis max-w-[100%]">
                  {subCategory.criterio}
                </div>
                <div>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="hover:border-blue-400 transition-all border-[1px] bg-white border-gray-300 flex h-10 items-center px-4 text-gray-400 rounded-lg text-xs font-bold w-fit outline-none"
                    id="pontos"
                    value={subCategory.pontos}
                  />
                </div>
                <div>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="hover:border-blue-400 transition-all border-[1px] bg-white border-gray-300 flex h-10 items-center px-4 text-gray-400 rounded-lg text-xs font-bold w-fit outline-none"
                    id="pontuacao_maxima"
                    value={subCategory.pontuacao_maxima}
                  />
                </div>

                <div className="flex gap-4 w-full overflow-x-auto elementBarra pb-2">
                {researcher.map((props) => {
                  // Titulações
                  if (subCategory.codigo === '2' && props.graduation == "Pós-Doutorado") {
                    return (
                      <div
                        key={props.id}
                        className="group transition-all pr-4 border-[1px] bg-white border-gray-300 flex h-10 items-center text-gray-400 rounded-md text-xs font-bold w-fit gap-3"
                      >
                        <div
                          className="rounded-l-md w-[40px] h-[40px] bg-cover bg-center bg-no-repeat"
                          style={{ backgroundImage: `url(http://servicosweb.cnpq.br/wspessoa/servletrecuperafoto?tipo=1&id=${props.lattes_10_id})` }}
                        ></div>
                        {props.totalTitulacaoPoints}
                      </div>
                    );
                  }

                  if (subCategory.codigo === '3' && props.graduation == "Doutorado") {
                    return (
                      <div
                        key={props.id}
                        className="group transition-all pr-4 border-[1px] bg-white border-gray-300 flex h-10 items-center text-gray-400 rounded-md text-xs font-bold w-fit gap-3"
                      >
                        <div
                          className="rounded-l-md w-[40px] h-[40px] bg-cover bg-center bg-no-repeat"
                          style={{ backgroundImage: `url(http://servicosweb.cnpq.br/wspessoa/servletrecuperafoto?tipo=1&id=${props.lattes_10_id})` }}
                        ></div>
                        {props.totalTitulacaoPoints}
                      </div>
                    );
                  }

                  if (subCategory.codigo === '4' && props.graduation == "Mestrado") {
                    return (
                      <div
                        key={props.id}
                        className="group transition-all pr-4 border-[1px] bg-white border-gray-300 flex h-10 items-center text-gray-400 rounded-md text-xs font-bold w-fit gap-3"
                      >
                        <div
                          className="rounded-l-md w-[40px] h-[40px] bg-cover bg-center bg-no-repeat"
                          style={{ backgroundImage: `url(http://servicosweb.cnpq.br/wspessoa/servletrecuperafoto?tipo=1&id=${props.lattes_10_id})` }}
                        ></div>
                        {props.totalTitulacaoPoints}
                      </div>
                    );
                  }

                  if (subCategory.codigo === '21' && props.graduation == "Especialização") {
                    return (
                      <div
                        key={props.id}
                        className="group transition-all pr-4 border-[1px] bg-white border-gray-300 flex h-10 items-center text-gray-400 rounded-md text-xs font-bold w-fit gap-3"
                      >
                        <div
                          className="rounded-l-md w-[40px] h-[40px] bg-cover bg-center bg-no-repeat"
                          style={{ backgroundImage: `url(http://servicosweb.cnpq.br/wspessoa/servletrecuperafoto?tipo=1&id=${props.lattes_10_id})` }}
                        ></div>
                        {props.totalTitulacaoPoints}
                      </div>
                    );
                  }

                    // Artigo em periódicos qualificados (A ou B)
                    if (subCategory.codigo === '6') {
                      return (
                        <div
                          key={props.id}
                          className="group transition-all pr-4 border-[1px] bg-white border-gray-300 flex h-10 items-center text-gray-400 rounded-md text-xs font-bold w-fit gap-3"
                        >
                          <div
                            className="rounded-l-md w-[40px] h-[40px] bg-cover bg-center bg-no-repeat"
                            style={{ backgroundImage: `url(http://servicosweb.cnpq.br/wspessoa/servletrecuperafoto?tipo=1&id=${props.lattes_10_id})` }}
                          ></div>
                          {props.totalArticlesPoints}
                        </div>
                      );
                    }

                    // Outros (Especia e TCC)
                    if (subCategory.codigo === '25') {
                      return (
                        <div
                          key={props.id}
                          className="group transition-all pr-4 border-[1px] bg-white border-gray-300 flex h-10 items-center text-gray-400 rounded-md text-xs font-bold w-fit gap-3"
                        >
                          <div
                            className="rounded-l-md w-[40px] h-[40px] bg-cover bg-center bg-no-repeat"
                            style={{ backgroundImage: `url(http://servicosweb.cnpq.br/wspessoa/servletrecuperafoto?tipo=1&id=${props.lattes_10_id})` }}
                          ></div>
                          {props.totalEspTccPoints}
                        </div>
                      );
                    }

                    // Patente
                    if (subCategory.codigo === '22') {
                      return (
                        <div
                          key={props.id}
                          className="group transition-all pr-4 border-[1px] bg-white border-gray-300 flex h-10 items-center text-gray-400 rounded-md text-xs font-bold w-fit gap-3"
                        >
                          <div
                            className="rounded-l-md w-[40px] h-[40px] bg-cover bg-center bg-no-repeat"
                            style={{ backgroundImage: `url(http://servicosweb.cnpq.br/wspessoa/servletrecuperafoto?tipo=1&id=${props.lattes_10_id})` }}
                          ></div>
                          {props.totalPatentePoints}
                        </div>
                      );
                    }

                    // Sotware e marca
                    if (subCategory.codigo === '23') {
                     
                      return (
                        <div
                          key={props.id}
                          className="group transition-all pr-4 border-[1px] bg-white border-gray-300 flex h-10 items-center text-gray-400 rounded-md text-xs font-bold w-fit gap-3"
                        >
                          <div
                            className="rounded-l-md w-[40px] h-[40px] bg-cover bg-center bg-no-repeat"
                            style={{ backgroundImage: `url(http://servicosweb.cnpq.br/wspessoa/servletrecuperafoto?tipo=1&id=${props.lattes_10_id})` }}
                          ></div>
                          {props.totalSofwareBrandPoints}
                        </div>
                      );
                    }

                    // Livros
                    if (subCategory.codigo === '7') {
                     
                      return (
                        <div
                          key={props.id}
                          className="group transition-all pr-4 border-[1px] bg-white border-gray-300 flex h-10 items-center text-gray-400 rounded-md text-xs font-bold w-fit gap-3"
                        >
                          <div
                            className="rounded-l-md w-[40px] h-[40px] bg-cover bg-center bg-no-repeat"
                            style={{ backgroundImage: `url(http://servicosweb.cnpq.br/wspessoa/servletrecuperafoto?tipo=1&id=${props.lattes_10_id})` }}
                          ></div>
                          {props.totalBookPoints}
                        </div>
                      );
                    }

                    // Cap de Livros
                    if (subCategory.codigo === '8') {
                      return (
                        <div
                          key={props.id}
                          className="group transition-all pr-4 border-[1px] bg-white border-gray-300 flex h-10 items-center text-gray-400 rounded-md text-xs font-bold w-fit gap-3"
                        >
                          <div
                            className="rounded-l-md w-[40px] h-[40px] bg-cover bg-center bg-no-repeat"
                            style={{ backgroundImage: `url(http://servicosweb.cnpq.br/wspessoa/servletrecuperafoto?tipo=1&id=${props.lattes_10_id})` }}
                          ></div>
                          {props.totalChapterPoints}
                        </div>
                      );
                    }

                    // Orientações em andamento - pos
                    if (subCategory.codigo === '10') {
                      return (
                        <div
                          key={props.id}
                          className="group transition-all pr-4 border-[1px] bg-white border-gray-300 flex h-10 items-center text-gray-400 rounded-md text-xs font-bold w-fit gap-3"
                        >
                          <div
                            className="rounded-l-md w-[40px] h-[40px] bg-cover bg-center bg-no-repeat"
                            style={{ backgroundImage: `url(http://servicosweb.cnpq.br/wspessoa/servletrecuperafoto?tipo=1&id=${props.lattes_10_id})` }}
                          ></div>
                          {props.totalPosAPoints}
                        </div>
                      );
                    }

                     // Orientações em andamento - ic
                     if (subCategory.codigo === '11') {
                      return (
                        <div
                          key={props.id}
                          className="group transition-all pr-4 border-[1px] bg-white border-gray-300 flex h-10 items-center text-gray-400 rounded-md text-xs font-bold w-fit gap-3"
                        >
                          <div
                            className="rounded-l-md w-[40px] h-[40px] bg-cover bg-center bg-no-repeat"
                            style={{ backgroundImage: `url(http://servicosweb.cnpq.br/wspessoa/servletrecuperafoto?tipo=1&id=${props.lattes_10_id})` }}
                          ></div>
                          {props.totalIcAPoints}
                        </div>
                      );
                    }

                    // Orientações concluidas - doutorado
                    if (subCategory.codigo === '13') {
                      return (
                        <div
                          key={props.id}
                          className="group transition-all pr-4 border-[1px] bg-white border-gray-300 flex h-10 items-center text-gray-400 rounded-md text-xs font-bold w-fit gap-3"
                        >
                          <div
                            className="rounded-l-md w-[40px] h-[40px] bg-cover bg-center bg-no-repeat"
                            style={{ backgroundImage: `url(http://servicosweb.cnpq.br/wspessoa/servletrecuperafoto?tipo=1&id=${props.lattes_10_id})` }}
                          ></div>
                          {props.totalDoutoradoCPoints}
                        </div>
                      );
                    }

                    // Orientações concluidas - mestrado
                    if (subCategory.codigo === '14') {
                      return (
                        <div
                          key={props.id}
                          className="group transition-all pr-4 border-[1px] bg-white border-gray-300 flex h-10 items-center text-gray-400 rounded-md text-xs font-bold w-fit gap-3"
                        >
                          <div
                            className="rounded-l-md w-[40px] h-[40px] bg-cover bg-center bg-no-repeat"
                            style={{ backgroundImage: `url(http://servicosweb.cnpq.br/wspessoa/servletrecuperafoto?tipo=1&id=${props.lattes_10_id})` }}
                          ></div>
                          {props.totalMestradoCPoints}
                        </div>
                      );
                    }

                    // Orientações concluidas - lato sensu
                    if (subCategory.codigo === '15') {
                      return (
                        <div
                          key={props.id}
                          className="group transition-all pr-4 border-[1px] bg-white border-gray-300 flex h-10 items-center text-gray-400 rounded-md text-xs font-bold w-fit gap-3"
                        >
                          <div
                            className="rounded-l-md w-[40px] h-[40px] bg-cover bg-center bg-no-repeat"
                            style={{ backgroundImage: `url(http://servicosweb.cnpq.br/wspessoa/servletrecuperafoto?tipo=1&id=${props.lattes_10_id})` }}
                          ></div>
                          {props.totalLatoSensuPoints}
                        </div>
                      );
                    }

                    // Orientações concluidas - ic
                    if (subCategory.codigo === '16') {
                      return (
                        <div
                          key={props.id}
                          className="group transition-all pr-4 border-[1px] bg-white border-gray-300 flex h-10 items-center text-gray-400 rounded-md text-xs font-bold w-fit gap-3"
                        >
                          <div
                            className="rounded-l-md w-[40px] h-[40px] bg-cover bg-center bg-no-repeat"
                            style={{ backgroundImage: `url(http://servicosweb.cnpq.br/wspessoa/servletrecuperafoto?tipo=1&id=${props.lattes_10_id})` }}
                          ></div>
                          {props.totalIcCPoints}
                        </div>
                      );
                    }

                    // organização
                    if (subCategory.codigo === '18') {
                      return (
                        <div
                          key={props.id}
                          className="group transition-all pr-4 border-[1px] bg-white border-gray-300 flex h-10 items-center text-gray-400 rounded-md text-xs font-bold w-fit gap-3"
                        >
                          <div
                            className="rounded-l-md w-[40px] h-[40px] bg-cover bg-center bg-no-repeat"
                            style={{ backgroundImage: `url(http://servicosweb.cnpq.br/wspessoa/servletrecuperafoto?tipo=1&id=${props.lattes_10_id})` }}
                          ></div>
                          {props.totalOrganizacaoPoints}
                        </div>
                      );
                    }

                    // participacao
                    if (subCategory.codigo === '19') {
                      return (
                        <div
                          key={props.id}
                          className="group transition-all pr-4 border-[1px] bg-white border-gray-300 flex h-10 items-center text-gray-400 rounded-md text-xs font-bold w-fit gap-3"
                        >
                          <div
                            className="rounded-l-md w-[40px] h-[40px] bg-cover bg-center bg-no-repeat"
                            style={{ backgroundImage: `url(http://servicosweb.cnpq.br/wspessoa/servletrecuperafoto?tipo=1&id=${props.lattes_10_id})` }}
                          ></div>
                          {props.totalParticipacaoPoints}
                        </div>
                      );
                    }

                    // work event
                    if (subCategory.codigo === '20') {
                      return (
                        <div
                          key={props.id}
                          className="group transition-all pr-4 border-[1px] bg-white border-gray-300 flex h-10 items-center text-gray-400 rounded-md text-xs font-bold w-fit gap-3"
                        >
                          <div
                            className="rounded-l-md w-[40px] h-[40px] bg-cover bg-center bg-no-repeat"
                            style={{ backgroundImage: `url(http://servicosweb.cnpq.br/wspessoa/servletrecuperafoto?tipo=1&id=${props.lattes_10_id})` }}
                          ></div>
                          {props.totalWorkEventPoints}
                        </div>
                      );
                    }
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex border py-6 gap-8 border-gray-300 px-12 rounded-b-2xl bg-gray-50 items-center justify-between">
        {/* subtotal */}
        <p className="text-gray-400 whitespace-nowrap flex items-center gap-2">
          Subtotal (máximo a ser considerado
          <input
            type="number"
            min="0"
            value={parentCategory.pontuacao_maxima}
            className="border-[1px] w-12 bg-white border-gray-300 flex h-10 items-center px-4 text-gray-400 hover:border-blue-400 transition-all rounded-lg text-xs font-bold outline-none"
          />
          pontos)
        </p>

        <div className="flex gap-4 w-full overflow-x-auto elementBarra pb-2"></div>
      </div>
    </div>
  ))
}

    </div> 

    <div className="z-[-999999] mb-12 justify-center flex flex-col items-center gap-4 w-full  p-12  bg-white border border-gray-300 rounded-2xl">
    <h1 className=" w-full text-3xl text-center mb-4 font-normal max-w-[750px]  py-12 ">

      <strong className="bg-red-400 text-white font-normal">
      Resultado
      </strong>{" "}
      e classificação dos pesquisadores
      </h1>

      <div className="flex flex-col gap-4 w-full">
      <div className="w-full grid grid-cols-3 mb-4 bg-white sticky top-0">
              <p className="text-gray-400">Classificação</p>
              <div className="text-gray-400 grid grid-cols-5 gap-4">
              {categories.map((parentCategory) => (
                <p className="text-gray-400 truncate" key={parentCategory.codigo}>{parentCategory.criterio}</p>
              ))}
              
              </div>
              <p className="text-gray-400 text-right">Pontuação total</p>
            </div>

            </div>

            <div className="w-full">
            <div className="flex flex-col gap-4 w-full">
            {sortedResearcher.map((researcherProps) => (
            <div className="w-full grid grid-cols-3 mb-4" key={researcherProps.id}>
              <div
                          key={researcherProps.id}
                          className="group transition-all pr-4 border-[1px] bg-white border-gray-300 flex h-10 items-center text-gray-400 rounded-md text-xs font-bold w-fit gap-3"
                        >
                          <div
                            className="rounded-l-md w-[40px] h-[40px] bg-cover bg-center bg-no-repeat"
                            style={{ backgroundImage: `url(http://servicosweb.cnpq.br/wspessoa/servletrecuperafoto?tipo=1&id=${researcherProps.lattes_10_id})` }}
                          ></div>
                          {researcherProps.researcher}
                        </div>
              <div className="text-gray-400 grid grid-cols-5 gap-4">
                <div className="  border-[1px] bg-white border-gray-300 flex h-10 items-center justify-center text-gray-400 rounded-md text-xs font-bold w-full">{researcherProps.totalTitulacaoPoints}</div>
                <div className="  border-[1px] bg-white border-gray-300 flex h-10 items-center justify-center text-gray-400 rounded-md text-xs font-bold w-full">{researcherProps.TotalProducaoBibliografica}</div>
                <div className="  border-[1px] bg-white border-gray-300 flex h-10 items-center justify-center text-gray-400 rounded-md text-xs font-bold w-full">{researcherProps.TotalRecursosHumanosAndamento}</div>
                <div className="  border-[1px] bg-white border-gray-300 flex h-10 items-center justify-center text-gray-400 rounded-md text-xs font-bold w-full">{researcherProps.TotalRecursosHumanosConcluido}</div>
                <div className="  border-[1px] bg-white border-gray-300 flex h-10 items-center justify-center text-gray-400 rounded-md text-xs font-bold w-full">{researcherProps.TotalParticipacaoEventos}</div>
              </div>
              <div className="px-8  border-[1px] bg-white border-gray-300 flex h-10 items-center justify-center text-gray-400 rounded-md text-xs font-bold w-fit right-0 ml-auto">{researcherProps.TotalBarema}</div>
            </div>
          ))}

            </div>
            </div>
      
    </div>  

    <div className="z-[-999999] justify-center flex flex-col items-center gap-4 w-full  p-12  bg-white border border-gray-300 rounded-2xl">
    <h1 className=" text-3xl text-center mb-4 font-normal  py-12 ">

    <strong className="bg-red-400 text-white font-normal">
    Gráfico
    </strong>{" "}
    de pontuação total e ranking
    </h1>

    <div className="w-full">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
    </div>


    <div className="mt-12 grid grid-cols-2 gap-12">
      <div className=" h-[450px] justify-between flex flex-col gap-4 w-full  p-12  bg-white border border-gray-300 rounded-2xl">
      <div>
      <h1 className=" w-full text-3xl text-left mb-2 font-normal max-w-[750px]  pt-12 ">
              
              <strong className="bg-red-400 text-white font-normal">
              Exportação
              </strong>{" "}
              dos dados
              </h1>
        
              <p className="mb-8">Voce pode baixar os dados em uma planilha .csv ou salvar esse barema com os critérios e os pesquisadores selecionados para acessar posteriormente</p>
      </div>

      <div className="flex gap-4">

        
        {loggedIn  ? (
          <div  onClick={() => handleClickAdicionarBtn()} className="w-full mb-2  text-blue-400 text-sm font-bold cursor-pointer h-12 p-6  border-[1px] border-solid bg-white border-gray-300 rounded-xl justify-center items-center flex outline-none  hover:bg-gray-50  gap-3  transition ">
          <Textbox size={16} className="" />Salvar barema
        </div>
        ):(

          <Link  to={"/login"} className="w-full mb-2  text-blue-400 text-sm font-bold cursor-pointer h-12 p-6  border-[1px] border-solid bg-white border-gray-300 rounded-xl justify-center items-center flex outline-none  hover:bg-gray-50  gap-3  transition ">
          <SignIn size={16} className="" />Fazer login
        </Link>
        )}

<div onClick={downloadCSV} className="w-fit cursor-pointer h-12 whitespace-nowrap flex items-center gap-4 bg-blue-400 text-white rounded-xl px-6 py-2 justify-center hover:bg-blue-500 text-sm font-medium transition">
                
                <DownloadSimple size={16} className="text-white" />
                Baixar CSV
          </div>
      </div>
      </div>
    </div>
           
    </div>
           </div>

           {popUpProgram && pesquisadoresSelecionadosGroupBarema != "" ? (
                <PopUpWrapper
                title="Print ('Bem-vindo/a')"
                subtitle="Novo usuário?"
                textLink="Criar conta"
                link="/signup"
                >
                    <div className="w-full h-full flex">
                        <div className=" flex flex-1 p-6">
                        <div
                        className="rounded-xl flex-col p-6 bg-blue-100 bg-cover flex  bg-right bg-no-repeat w-full h-full mr-6"
                     
                        >

<div className="flex gap-4 w-full pb-8 justify-between items-center min-w-full">
          <div className="flex gap-4">
            <UserList size={24} className="text-gray-400" />
            <p className="text-gray-400">Pesquisadores selecionados no barema</p>
          </div>

          <div className="flex gap-4">
            
          </div>
        </div>
                           
                           <div className='h-full overflow-y-auto elementBarra'>
                 {researcherSelecionados.length == 0 ? (
        <div className="text-gray-400 mb-4 ">Nenhum pesquisador selecionado</div>
      ) : (
        <div className="mb-4 flex flex-col gap-4  m-[0 auto] w-full">
          {researcherSelecionados.map(user => {
            return (
              <li key={user.id} className="list-none">
                <div className="rounded-xl p-4 border-[1px] bg-white border-gray-300 flex gap-4 items-center justify-between">
                  <div className="flex gap-4 items-center">
                    <div className="bg-cover border-[1px] border-gray-300 bg-center bg-no-repeat h-16 w-16 bg-white rounded-md relative" style={{ backgroundImage: `url(http://servicosweb.cnpq.br/wspessoa/servletrecuperafoto?tipo=1&id=${user.lattes_10_id}) ` }}></div>

                    <div className="flex flex-col flex-1">
                      <h4 className="text-base font-medium  mb-1">{user.name}</h4>
                      <div className="flex items-center gap-2">
                        <Buildings size={16} className="text-gray-500" />
                        <p className="text-[13px]  text-gray-500">{user.university}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex ml-auto"><div className="border-[1px] border-gray-300 py-2 flex px-4 text-gray-400 rounded-md text-xs font-medium gap-2 items-center"> <ChartBar size={16} className="text-gray-400" />
                  {researcher.map((item) => (
                    item.id === user.id ? (
                      <span key={item.id}>{item.TotalBaremaFormated}</span>
                    ) : null
                  ))}
    </div></div>

                  <div>

                  </div>
                </div>
              </li>
            )
          })}
        </div>
      )}

      
                 </div>




                        </div>
                        </div>

                        <div className="">
                            <div className="h-full max-w-[500px] ">
                                <div className=" border-l h-full pb-[96px] overflow-y-auto elementBarra border-l-gray-300 p-12 ">
                                <div onClick={() => setPopUpProgram(false)} className={`ml-auto float-right cursor-pointer rounded-xl hover:bg-gray-100 h-[38px] w-[38px] transition-all flex items-center justify-center `}>
                        <X size={20} className={'rotate-180 transition-all text-gray-400'} />
                        </div>
                                
                                <h3 className="max-w-[250px] font-medium text-2xl mb-4 text-gray-400">Cadastrar barema de <strong className="bg-blue-400 text-white hover:bg-blue-500 transition duration-500 font-medium">avaliação</strong></h3>
                                    <p className="  text-gray-400 mb-8">
                                        Adicione as informações básicas do barema para salvá-lo, você poderá acessar posteriormente sempre que estiver logado com sua conta
                                    </p>

                                    <form className="w-full ">
                           <div className="flex gap-4 items-center mb-6 justify-center">
                           <p className="text-sm text-gray-500 ">Nome do barema</p>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            
                                required
                                className=" flex-1  border-[1px] border-gray-300 w-full h-12 rounded-xl outline-none p-4 text-md hover:border-blue-400 focus:border-blue-400" />
                           </div>

                            <div className="flex flex-col gap-6">

                            <div className="flex justify-center items-center gap-4 ">
                                <p className="text-sm text-gray-500 ">Ano das orientações em andamento e concluidas</p>
                                <input
                                    type="text"
                                    value={anoOri}
                                    onChange={(e) => setAnoOri(parseInt(e.target.value))}
                                
                                    required
                                    className=" border-[1px] flex flex-1 border-gray-300 w-full h-12 rounded-xl outline-none p-4 text-md hover:border-blue-400 focus:border-blue-400" />
                                </div>

                                <div className="flex justify-center items-center gap-4 mb-6">
                                <p className="text-sm text-gray-500 mb-2">Ano das produções</p>
                                <input
                                    type="number"
                                    value={ano}
                                    onChange={(e) => setAno(parseInt(e.target.value))}
                                
                                    required
                                    className=" border-[1px] flex flex-1 border-gray-300 w-full h-12 rounded-xl outline-none p-4 text-md hover:border-blue-400 focus:border-blue-400" />
                                </div>

                               
                            </div>

                            <div className="flex gap-4  flex-col">
                            <p className="text-sm text-gray-500 mb-2">Selecione os qualis desejados</p>
                            <div className="gap-4 flex flex-wrap ">
                          {checkboxQualis}
                        </div>
                      </div>
     
                            </form>
                                </div>

                                <div className="flex border-l  border-l-gray-300 gap-6 px-12 py-6 bg-white top-[-96px] z-[99] right-0 relative">
                            <div onClick={handleSubmit} className="whitespace-nowrap flex cursor-pointer items-center gap-4 bg-blue-400 text-white rounded-xl px-4 py-2 justify-center hover:bg-blue-500  font-medium transition flex-1 h-12 ml-auto">
                                <Upload size={16} className="text-white" /> Salvar barema
                            </div>

                            



                            </div>

                            </div>
                        </div>
                    </div>

                </PopUpWrapper>
            ):(
                ``
            )}


{popUpSuccess && (
        <div className="fixed right-16 bottom-16 z-[99999999999999] ">
        <div className=" rounded-xl bg-white border shadow-md border-gray-300 p-6 flex items-center justify-center gap-4">
          <div><CheckCircle size={32} className={' text-green-400'} /></div>
          <div>Barema submetido com sucesso!</div>
        </div>
    </div>
      )}

        </div>
    )
}