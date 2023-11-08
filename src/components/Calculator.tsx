import React, { useState } from "react";

interface TitulacaoCalculatorProps {
  titulacao: string;
}

export function Calculator(props: TitulacaoCalculatorProps) {
  const [pontos, setPontos] = useState<number>(0);
  const [quantidade, setQuantidade] = useState<number>(0);
  const [resultado, setResultado] = useState<number | null>(null);

  const calcularResultado = () => {
    const resultadoCalculado = pontos * quantidade;
    setResultado(resultadoCalculado);
  };

  return (
    <div>
      <div>
        <div>{props.titulacao}</div>
        <input
          type="number"
          min={0}
          max={100}
          value={pontos}
          onChange={(e) => setPontos(Number(e.target.value))}
        />
        <input
          type="number"
          min={0}
          max={100}
          value={quantidade}
          onChange={(e) => setQuantidade(Number(e.target.value))}
        />
        <div>Resultado: {resultado !== null ? resultado : ""}</div>
      </div>
      <button onClick={calcularResultado}>Calcular</button>
    </div>
  );
};

