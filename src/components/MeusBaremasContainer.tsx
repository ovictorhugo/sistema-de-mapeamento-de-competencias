import { useContext, useEffect, useState } from 'react';
import bg_popup from '../assets/bg_popup.png';
import { HeaderBarema } from './HeaderBarema';
import { UserContext } from '../contexts/context';

import { getFirestore, doc, getDocs, collection, addDoc,query,  where,  Query } from 'firebase/firestore';
import { Article } from 'phosphor-react';

interface UserData {
    name: string,
    data: string,
    ano: string,
    anoOr: string,
    qualisSelecionado: string,
    pesquisadoresSelecionadosGroupBarema: string,
    userId: string,
    researcher: string,
  }


export function MeusBaremasContainer() {
    const { user, setUser } = useContext(UserContext);

    const [userData, setUserData] = useState<UserData | null>(null);

    const db = getFirestore();
   

    const userId = user && user.uid;

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
               
                
                const userData = userDocSnapshot.docs[0].data() as UserData;
  setUserData(userData);

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
      


    
    return  (
        <div className=" min-h-screen ">

        <div className="absolute  w-full top-0 left-0 z-[-9]">
                <div className="w-full  h-[70vh] bg-blue-400   " >
                  <div className="w-full h-full bg-cover opacity-20 " style={{ backgroundImage: `url(${bg_popup})` }}>

                  </div>
                </div>
            </div>

          <div className=" h-full w-full md:px-16 px-6 pb-16">
       <div className='z-[99999999999]'>
       <HeaderBarema/>

<div className='mb-[20px] z-[99999999999]'>
<div className="flex gap-4 text-white pt-12">
              <Article size={24} className=" mb-4" />
              <p className="text-bold text-2xl">Meus baremas de avaliação</p>
            </div>

<p className="text-white max-w-[750px] pb-8 ">O sistema de classificação, é uma estrutura criada para avaliar e classificar pesquisadores com base em critérios específicos como qualidade e quantidade de publicações, impacto da pesquisa, contribuições para a comunidade científica, atividades de ensino e entre outros.</p>
</div>
       </div>

       <div>
        <div className='w-full grid grid-cols-5 gap-6'>

        {userData && (
  <div>
    {/* Render your item content here */}
    <p>{userData.name}</p>
    {/* Add other elements based on your data structure */}
  </div>
)}
        </div>
       </div>
        </div>
        </div>
    )
}