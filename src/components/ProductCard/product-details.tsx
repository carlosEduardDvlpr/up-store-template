import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { parseTextToItems } from "@/lib/utils";

const measurementsText = `PP</br>\r\nComprimento total 139 cm</br>\r\nBusto 60 cm</br>\r\nCintura 62 cm </br>\r\nQuadril 80 cm </br>\r\nBarra 132 cm </br>\r\n</br>P</br>\r\nComprimento total 140,5 cm</br>\r\nBusto 64 cm</br>\r\nCintura 66 cm </br>\r\nQuadril 84 cm </br>\r\nBarra 136 cm </br>\r\n</br>M</br>\r\nComprimento total 142 cm</br>\r\nBusto 68 cm</br>\r\nCintura 70 cm </br>\r\nQuadril 88 cm </br>\r\nBarra 140 cm </br>\r\n</br>G</br>\r\nComprimento total 143,5 cm</br>\r\nBusto 72 cm</br>\r\nCintura 74 cm </br>\r\nQuadril 92 cm </br>\r\nBarra 144 cm </br>`;

export function ProductDetails() {
  const measurements = parseTextToItems(measurementsText);
  return (
    <div className="px-3 py-4 border-gray-200 text-gray-500 md:max-w-[76vw] mx-auto">
      <Accordion type="single" collapsible defaultValue="">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-gray-900 text-sm md:text-base">
            Tabela de Medidas
          </AccordionTrigger>
          <AccordionContent className="prose prose-sm mt-2 md:mt-4 text-xs md:text-sm">
            <ul role="list">
              {measurements.map((section, index) => (
                <li key={index}>
                  {section.map((item, itemIndex) => (
                    <span key={itemIndex} className="text-xs md:text-sm">
                      {item}
                      <br />
                    </span>
                  ))}
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger className="text-gray-900">
            Guia de Medidas
          </AccordionTrigger>
          <AccordionContent>
            <Table className="text-xs md:text-sm">
              <TableHeader>
                <TableRow>
                  <TableHead>{"Medidas"}</TableHead>
                  <TableHead className="text-center">{"P (S)"}</TableHead>
                  <TableHead className="text-center">{"M (M)"}</TableHead>
                  <TableHead className="text-center">{"G (L)"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-base">BUSTO</TableCell>
                  <TableCell className="text-center">90 cm</TableCell>
                  <TableCell className="text-center">94 cm</TableCell>
                  <TableCell className="text-center">98 cm</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-base">CINTURA</TableCell>
                  <TableCell className="text-center">70 cm</TableCell>
                  <TableCell className="text-center">74 cm</TableCell>
                  <TableCell className="text-center">78 cm</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-base">CINTURA BAIXA</TableCell>
                  <TableCell className="text-center">85 cm</TableCell>
                  <TableCell className="text-center">89 cm</TableCell>
                  <TableCell className="text-center">93 cm</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-base">QUADRIL</TableCell>
                  <TableCell className="text-center">96 cm</TableCell>
                  <TableCell className="text-center">100 cm</TableCell>
                  <TableCell className="text-center">104 cm</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
