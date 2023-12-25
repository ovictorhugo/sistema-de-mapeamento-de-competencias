import { useContext, useEffect, useState } from 'react';
import bg_popup from '../assets/bg_popup.png';
import { HeaderBarema } from './HeaderBarema';
import { UserContext } from '../contexts/context';

import { updateDoc, deleteField, getFirestore, doc, getDocs, getDoc, collection, addDoc, query, deleteDoc,  where,  Query } from 'firebase/firestore';
import { Article, FileCsv, Plus, Trash, TrashSimple, Users } from 'phosphor-react';
import { Link, useNavigate } from 'react-router-dom';

interface UserData {
    [`Document ID`]: string
    id: string
    name: string,
    data: any,
    ano: string,
    anoOr: string,
    qualisSelecionado: string,
    pesquisadoresSelecionadosGroupBarema: string,
    userId: string,
    researcher: any,
    createdAt:string
  }


export function MeusBaremasContainer() {
    const { user, setUser } = useContext(UserContext);
    const { idBarema, setIdBarema } = useContext(UserContext);
    const { pesquisadoresSelecionadosGroupBarema, setPesquisadoresSelecionadosGroupBarema } = useContext(UserContext);
    const [userData, setUserData] = useState<UserData[] | null>(null);


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
               
                
                const userDataArray: UserData[] = userDocSnapshot.docs.map((doc) => {
                    // Get the document ID using .id
                    const documentId = doc.id;
                    // Combine document ID with document data
                    const userData = { ...(doc.data() as UserData), ['Document ID']: documentId };
                    return userData;
                  });
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
      

      const handleRemoveUserData = async (id: string, docId: string) => {
        try {
            console.log('Deleting barema with id:', id);
        
            const baremaDocRef = doc(db, 'baremas', docId);
        
            // Adicione um log antes da exclusão
            console.log('Before deletion - Barema Doc Ref:', baremaDocRef);

            const userDocsRef = collection(db, 'baremas');
            const userDocsQuery = query(userDocsRef, where('id', '==', id));
            const userDocSnapshot = await getDocs(userDocsQuery);
        
            // Verifique se o documento existe antes de tentar excluir
           
        
            if (userDocSnapshot.size > 0) {
                setUserData((prevUserData) =>
                (prevUserData || []).filter((userData) => userData.id !== id)
                );
              // Adicione uma verificação de autorização aqui, se necessário
              await deleteDoc(doc(db, 'baremas', docId));
              await updateDoc(baremaDocRef, {
                id: deleteField(),
                name: deleteField(),
                data: deleteField(),
                ano: deleteField(),
                anoOr: deleteField(),
                qualisSelecionado: deleteField(),
                pesquisadoresSelecionadosGroupBarema: deleteField(),
                userId: deleteField(),
                researcher: deleteField(),
                createdAt:deleteField(),
                ['Document ID']:deleteField(),
            });

           
            
              console.log('Barema deleted successfully.');
            } else {
              console.log('Barema does not exist.');
            }
        
            // Adicione um log após a exclusão
            console.log('After deletion - Barema Doc Ref:', baremaDocRef);
        
            // Restante do código...
          } catch (error) {
            console.error('Error deleting barema:', error);
          }
      };
      



      const history = useNavigate();
      const handleBarema = async (idBarema: string) => {
        setIdBarema(idBarema)

        const matchingUser = userData?.find((user) => user.id === idBarema);

        if (matchingUser) {
          // Set the data state to the data property of the matching user
       
          setPesquisadoresSelecionadosGroupBarema(matchingUser.pesquisadoresSelecionadosGroupBarema)
        } else {
          // Handle the case where no matching user is found
          // You might want to set data to an empty array or handle it differently
        }
        setTimeout(() => {
            history('/barema');
          }, 0);
      };
    
    return  (
        <div className=" min-h-screen ">

        <div className="absolute  w-full top-0 left-0 z-[-9]">
                <div className="w-full  h-[45vh] bg-blue-400   " >
                  <div className="w-full h-full bg-cover opacity-20 " style={{ backgroundImage: `url(${bg_popup})` }}>

                  </div>
                </div>
            </div>

          <div className=" h-full w-full md:px-16 px-6 pb-16">
       <div className='z-[99999999999]'>
       <HeaderBarema/>

<div className='mb-[20px] z-[99999999999]'>
<div className="flex gap-4 text-white pt-12 items-center mb-4">
              <Article size={24} className="" />
              <p className="text-bold text-2xl">Meus baremas de avaliação</p>
            </div>

<p className="text-white max-w-[750px] pb-8 ">O sistema de classificação, é uma estrutura criada para avaliar e classificar pesquisadores com base em critérios específicos como qualidade e quantidade de publicações, impacto da pesquisa, contribuições para a comunidade científica, atividades de ensino e entre outros.</p>
</div>
       </div>

       <div>
        <div className='w-full grid grid-cols-5 gap-6'>

        <div className=' flex flex-col justify-between  rounded-xl cursor-pointer transition-all  min-h-[208px] '>
            <Link to={`/barema`} className='h-full border flex-1 text-blue-400 bg-white rounded-t-xl border-gray-300 hover:bg-gray-50 transition-all flex flex-col gap-3 items-center justify-center'>
            <Plus size={32} className=" " />
            <p className='font-medium text-sm'>Adicionar barema</p>
            </Link>

            <a  href="/public/modelo_barema.csv" download className='bg-white text-sm text-blue-400 font-medium border flex items-center justify-center gap-3 border-gray-300 border-t-0 h-12  transition-all w-full rounded-b-xl hover:bg-gray-50 '>
            <FileCsv size={16} className="" />Download modelo csv
            </a>
        </div>

        {userData && userData.length > 0 && (
           
                userData.map((user) => (
            <div>
                <div onClick={() => handleBarema(user.id)} className='border flex flex-col justify-between border-gray-300 rounded-xl cursor-pointer transition-all hover:bg-gray-50 bg-white min-h-[208px] p-6'>
            <div>
                <h3 className='font-medium text-xl text-gary-500'>{user.name}</h3>
                <p className='text-sm text-gray-400 mt-2'>{user.createdAt}</p>
            </div>


            <div className='flex justify-between gap-3'>
            <div>
            
            </div>
            <div className='flex gap-3 text-gray-400 items-center'>
            <Users size={20} className=" " />


            {user.researcher.slice(0, 3).map((props: { lattes_10_id: string }) => {
                    return (
                        <div
                        className="bg-cover border-[1px] border-gray-300 bg-center bg-no-repeat h-8 w-8 bg-white rounded-md relative"
                        style={{ backgroundImage: `url(http://servicosweb.cnpq.br/wspessoa/servletrecuperafoto?tipo=1&id=${props.lattes_10_id}) ` }}
                        ></div>
                    );
                    })}

                    {user.researcher.length > 3 ? (<p>+ {user.researcher.length -3}</p>):(``)}
            </div>

            
            </div>
        </div>
       <div className='ml-auto  z-[99999999999999999999999999999999999999999] absolute float-right w-max '>
       <div onClick={() => handleRemoveUserData(user.id, user[`Document ID`])} className={`ml-auto cursor-pointer rounded-md top-[-58px] right-[-24px] float-right relative hover:bg-gray-100 h-8 w-8 transition-all flex items-center justify-center `}>
                    <Trash size={20} className={' transition-all text-gray-400'} />
                    </div>
       </div>
       
            </div>
          ))
            
            )}
        </div>
       </div>
        </div>
        </div>
    )
}