import { MapPin, PlusCircle } from "phosphor-react";
import { MinhaConta } from "../components/MinhaConta";
import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/context";

const API_URL = `https://api.unsplash.com/search/photos`

const API_KEY = `GWIfxXRYK0wcvauiU8szwu9WuARg5_DpsR4F1jdQIvA`

export function Cities() {

    const { cidadeSelecionada, setCidadeSelecionada } = useContext(UserContext);

const [city, setCity] = useState([
    {id:1, name: `Salvador`, img_url: `https://mobilidade.estadao.com.br/wp-content/uploads/2022/02/Salvador.jpg`},
    {id:2, name: `Feira de Santana`, img_url: `https://feiradesantana.ba.gov.br/imagens/noticias/2882019105114.jpg`},
    {id:3, name: `Camaçari`, img_url: `https://www.camacari.ba.gov.br/wp-content/uploads/2018/09/Photo-by-Jos%C3%A9-Carlos-Almeida_CA50597-1024x683.jpg`},
    {id:4, name: `Juazeiro`, img_url: `https://juazeiro.ba.gov.br/wp-content/uploads/2022/01/JUAZEIRO-1-1.jpg`},
    {id:5, name: `Ilhéus`, img_url: `https://cf.bstatic.com/xdata/images/hotel/max1024x768/29988276.jpg?k=9961b1d63c325bd3fe3b9fff6777c1479107007d451601b9f715bd6f21554e8b&o=&hp=1`},
    {id:6, name: `Luís Eduardo Magalhàes`, img_url: `https://pivot.com.br/wp-content/uploads/2021/03/Luis_eduardo_Magalhaes_2020.png`},
    {id:7, name: `Vitória da Conquista`, img_url: `https://www.pmvc.ba.gov.br/wp-content/uploads/IMG-20200605-WA0018-e1638274428475.jpg`},
    {id:8, name: `Itabuna`, img_url: `https://amurc.com/images/blog/2018/02/13/municipios/itabuna.jpg`},
    {id:9, name: `Paulo Afonso`, img_url: `https://upload.wikimedia.org/wikipedia/commons/c/c1/Vista_de_Paulo_Afonso.jpg`},
    {id:10, name: `Barreiras`, img_url: `https://blog.deliverymuch.com.br/wp-content/uploads/2019/07/Delivery-Much-Barreiras-a-for%C3%A7a-da-tecnologia-conquista-ao-interior-da-Bahia.jpg`},
    {id:11, name: `Jequié`, img_url: `https://upload.wikimedia.org/wikipedia/commons/c/c5/Centro_de_Jequi%C3%A9.jpg`},
    {id:12, name: `Teixeira de Freitas`, img_url: `https://upload.wikimedia.org/wikipedia/commons/2/22/Imagem_a%C3%A9rea_Teixeira_de_Freitas.png`},
])
const history = useNavigate();

const selecionarCidade = (event:any) => {

    setCidadeSelecionada(event)
  };

    return  (
<div className="mt-16  overflow-x-auto ">

<div className="flex gap-4 mb-8">
              <MapPin size={24} className="text-gray-400" />
              <p className="text-gray-400">Pesquise por cidades baianas e suas economias</p>
            </div>

<div className="grid grid=cols-2 ">
  <div className=" overflow-x-auto elementBarra flex gap-6 pb-4">
  {city.map(props => (
      <Link to={`/cidades`} key={props.name} onClick={() => selecionarCidade(props.name)}  style={{ backgroundImage: `url(${props.img_url})` }} className="flex-shrink-0 w-48 h-[260px] transition-all hover:scale-[95%] bg-cover bg-center bg-no-repeat cursor-pointer rounded-xl relative">
        <div className="absolute inset-0 bg-[#000] bg-opacity-40 rounded-xl flex items-end p-6">
          <h5 className="text-white font-medium text-xl">{props.name}</h5>
        </div>
      </Link>
    ))}

<Link to={`/cidades`} onClick={() => setCidadeSelecionada(``)} className="flex-shrink-0  hover:scale-[95%] w-48 text-gray-400 hover:bg-gray-50 transition-all h-[260px] border p-6 flex justify-between flex-col border-gray-300 bg-cover cursor-pointer rounded-xl relative">
<PlusCircle size={24} className="" />
<h5 className=" font-medium text-xl">Ver mais cidades</h5>
      </Link>
  </div>
</div>

</div>


    )
}