import { useContext, useEffect, useState } from 'react';
import bg_popup from '../assets/bg_popup.png';
import { HeaderBarema } from './HeaderBarema';
import { UserContext } from '../contexts/context';

import { getFirestore, doc, getDoc, collection, addDoc } from 'firebase/firestore';

interface User {
    someProperty: string;
    // Add other properties based on your data structure
  }


export function MeusBaremasContainer() {
    const { user, setUser } = useContext(UserContext);

    const [userData, setUserData] = useState<User[]>([]);
    const db = getFirestore();

   
  useEffect(() => {
    // Fetch user data when the component mounts
    const fetchUserData = async () => {
      try {
        // Assuming you have a 'users' collection in your database
        const userRef = firebase.database().ref(`users/${user.uid}`);
        const snapshot = await userRef.once('value');

        // Retrieve data from the snapshot
        const fetchedUserData = snapshot.val();
        setUserData(fetchedUserData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    // Check if user is defined before fetching data
    if (user) {
      fetchUserData();
    }
  }, [user]); // Run the effect when the user object changes

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
<h1 className="z-[999999] text-4xl mb-4 font-normal max-w-[750px] text-white pt-12 ">
Meus <strong className="bg-red-400 text-white font-normal"> baremas</strong>{" "} de avaliação 
</h1>

<p className="text-white max-w-[750px] pb-8">O sistema de classificação, é uma estrutura criada para avaliar e classificar pesquisadores com base em critérios específicos como qualidade e quantidade de publicações, impacto da pesquisa, contribuições para a comunidade científica, atividades de ensino e entre outros.</p>
</div>
       </div>

       <div>
        <div className='w-full grid grid-cols-5 gap-6'>

        {userData && userData.map((item, index) => (
        <div key={index}>
            {/* Render your item content here */}
            <p>{item.someProperty}</p>
            {/* Add other elements based on your data structure */}
        </div>
        ))}
        </div>
       </div>
        </div>
        </div>
    )
}