"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { CreateUserAddressForm } from "@/components/Forms/Address/address-form";
import { User } from "@/data/types/user";
import { useCheckout } from "@/contexts/checkout-context";

interface CreditCardFormProps {
  user: User;
}

export function CheckoutAddressSection({ user }: CreditCardFormProps) {
  const { selectedAddress, setSelectedAddress } = useCheckout();
  const [showAddressForm, setShowAddressForm] = useState(false);

  const addresses = user?.addresses;

  const handleAddressChange = async (value: string) => {
    if (value === "cadastre") {
      setShowAddressForm(true);
      setSelectedAddress(null);
    } else {
      setShowAddressForm(false);
      const selected = addresses.find(
        (address) => address.id.toString() === value,
      );
      setSelectedAddress(selected || null);
    }
  };

  return (
    <div className="col-span-full pt-6">
      <Select
        onValueChange={handleAddressChange}
        defaultValue={selectedAddress?.id.toString()}
      >
        <SelectTrigger className="text-base font-base">
          <SelectValue
            placeholder="Selecione um endereço"
            className="text-base font-base"
            defaultValue={selectedAddress?.id.toString()}
          />
        </SelectTrigger>
        <SelectContent id="addresses">
          <SelectItem
            value="cadastre"
            className="text-base font-base"
            defaultValue={selectedAddress?.id.toString()}
          >
            Cadastre um endereço
          </SelectItem>
          {addresses?.length > 0 &&
            addresses.map((address) => (
              <SelectItem
                key={address.id}
                value={address.id.toString()}
                className="text-base font-base"
              >
                {address.street}, {address.number} - CEP: {address.zip_code}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>

      {/* Conditionally render the form when 'Cadastre um endereço' is selected */}
      {showAddressForm && (
        <CreateUserAddressForm
          user={user}
          setShowForm={() => {
            setSelectedAddress(null);
            setShowAddressForm(false);
          }}
        />
      )}
    </div>
  );
}
