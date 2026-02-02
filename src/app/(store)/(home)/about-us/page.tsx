import { COMPANY_NAME } from "@/data/constants";

export default function AboutUsPage() {
  return (
    <div className="col col-span-1 w-full items-center justify-center">
      <div className="flex w-full h-40 bg-gray-200 p-2 items-center justify-left pl-4 text-4xl font-base lg:justify-center lg:items-center lg:h-60">
        <h1>A {COMPANY_NAME}</h1>
      </div>
      <div className="py-10 px-4 lg:px-40 lg:py-20 lg:mx-96 p-2 items-center justify-center text-sm font-base space-y-6 leading-loose">
        <p>
          {
            "A Kalli Fashion é uma marca online de moda feminina, nascida em São Paulo. Atuamos há mais de 20 anos no ramo da moda, a Kalli Fashion para atender nossas clientes de uma maneira nova e adaptada em um novo"
          }
        </p>
        <p>
          {
            "Atuamos há mais de 20 anos no ramo da moda, a Kalli Fashion para atender nossas clientes de uma maneira nova e adaptada em um novo. A Kalli Fashion tem missão de oferecer produtos em tendência, sempre buscando a disponibilizar os produtos chiques, elegantes e modernos com qualidade e diversidade, apresentando as novidades toda semana."
          }
        </p>
        <p>
          {
            "Nossos valores são ter criatividade e elegância nos produtos, e oferecer acessibilidade das roupas em tendência às mulheres, inclusive quem tem dificuldade de vestir e montar seus looks, disponibilizando produtos básicos com detalhes sofisticados que os valorizam."
          }
        </p>
      </div>
    </div>
  );
}
