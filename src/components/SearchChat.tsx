import { UserContext } from "../contexts/context";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Header } from "./Header";

export function SearchChat() {

    const { idVersao, setIdVersao } = useContext(UserContext);  

   

    return (
  
      <div className="h-screen">
      <Header/>
      </div>

      
    );
  }