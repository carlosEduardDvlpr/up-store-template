"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { CreateUserPhoneForm } from "@/components/Forms/Phone/phone-form";
import { User } from "@/data/types/user";
import { useCheckout } from "@/contexts/checkout-context";

interface CreditCardFormProps {
  user: User;
}

export function CheckoutPhoneSection({ user }: CreditCardFormProps) {
  const { selectedPhone, setSelectedPhone } = useCheckout();
  const [showPhoneForm, setShowPhoneForm] = useState(false);

  const phones = user?.phones;

  const handlePhoneChange = (value: string) => {
    if (value === "cadastre") {
      setShowPhoneForm(true);
      setSelectedPhone(null); // Optional: deselect phone if creating a new one
    } else {
      setShowPhoneForm(false);
      const selected = phones.find((phone) => phone.id.toString() === value);
      setSelectedPhone(selected || null);
    }
  };

  const handleCloseForm = () => {
    setSelectedPhone(null);
    setShowPhoneForm(false);
  };

  return (
    <div className="col-span-full mt-6">
      <Select
        onValueChange={handlePhoneChange}
        defaultValue={selectedPhone?.id.toString()}
      >
        <SelectTrigger className="text-base font-base">
          <SelectValue
            placeholder="Selecione um telefone"
            className="text-base font-base"
          />
        </SelectTrigger>
        <SelectContent id="phones">
          <SelectItem value="cadastre" className="text-base font-base">
            Cadastre um telefone
          </SelectItem>
          {phones?.length > 0 &&
            phones.map((phone) => (
              <SelectItem
                key={phone.id}
                value={phone.id.toString()}
                className="text-base font-base"
              >
                {`+55 ${phone.ddd_code} ${phone.number}`}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>

      {/* Conditionally render the form when 'Cadastre um endereço' is selected */}
      {showPhoneForm && (
        <CreateUserPhoneForm user={user} setShowForm={handleCloseForm} />
      )}
    </div>
  );
}
