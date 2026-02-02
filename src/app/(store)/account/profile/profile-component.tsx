"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { User } from "@/data/types/user";
import type { Address } from "@/data/types/addresses";
import type { Telephone } from "@/data/types/telephone";
import {
  type NewUpdateProfileFormData,
  ProfileForm,
} from "@/components/Forms/Profile";
import { CreateUserAddressForm } from "@/components/Forms/Address/address-form";
import { CreateUserPhoneForm } from "@/components/Forms/Phone/phone-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Home,
  MapPin,
  Phone,
  PlusCircle,
  UserIcon,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProfileProps {
  user: User;
  onUpdateProfile: (data: NewUpdateProfileFormData) => Promise<void>;
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: "easeIn",
    },
  },
};

export function ProfileComponent({ user, onUpdateProfile }: ProfileProps) {
  const [activeTab, setActiveTab] = useState("personal");
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [selectedPhone, setSelectedPhone] = useState<Telephone | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showPhoneForm, setShowPhoneForm] = useState(false);

  const addresses = user?.addresses || [];
  const phones = user?.phones || [];

  // const handleAddressChange = (value: string) => {
  //   if (value === "new") {
  //     setShowAddressForm(true)
  //     setSelectedAddress(null)
  //   } else {
  //     setShowAddressForm(false)
  //     const selected = addresses.find((address) => address.id.toString() === value)
  //     setSelectedAddress(selected || null)
  //   }
  // }

  const handleCloseAddressForm = () => {
    setSelectedAddress(null);
    setShowAddressForm(false);
  };

  // const handlePhoneChange = (value: string) => {
  //   if (value === "new") {
  //     setShowPhoneForm(true)
  //     setSelectedPhone(null)
  //   } else {
  //     setShowPhoneForm(false)
  //     const selected = phones.find((phone) => phone.id.toString() === value)
  //     setSelectedPhone(selected || null)
  //   }
  // }

  const handleClosePhoneForm = () => {
    setSelectedPhone(null);
    setShowPhoneForm(false);
  };

  return (
    <Card className="overflow-hidden bg-white shadow-md min-w-[50vw]">
      <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-800 pb-6 pt-8 text-white">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-white">
            <UserIcon className="h-8 w-8" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">
              {user.name || "Meu Perfil"}
            </CardTitle>
            <p className="mt-1 text-sm text-white/80">{user.email}</p>
          </div>
        </div>
      </CardHeader>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="border-b">
          <TabsList className="mx-4 mt-2 grid w-auto grid-cols-2">
            <TabsTrigger
              value="personal"
              className="data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900"
            >
              <UserIcon className="mr-2 h-4 w-4" />
              Pessoal
            </TabsTrigger>
            <TabsTrigger
              value="contact"
              className="data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900"
            >
              <Home className="mr-2 h-4 w-4" />
              Endereço e Telefone
            </TabsTrigger>
          </TabsList>
        </div>

        <CardContent className="p-6 mb-6">
          <AnimatePresence mode="wait">
            <TabsContent value="personal" asChild>
              <motion.div
                key="personal"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-6"
              >
                <ProfileForm user={user} onUpdateProfile={onUpdateProfile} />
              </motion.div>
            </TabsContent>

            <TabsContent value="contact" asChild>
              <motion.div
                key="contact"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-8"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-slate-600" />
                    <h3 className="text-lg font-medium">Endereço de Entrega</h3>
                  </div>

                  {addresses.length > 0 && !showAddressForm ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {addresses.map((address) => (
                        <div
                          key={address.id}
                          onClick={() => setSelectedAddress(address)}
                          className={`cursor-pointer rounded-lg border p-4 transition-all hover:border-slate-300 hover:shadow-sm ${
                            selectedAddress?.id === address.id
                              ? "border-2 border-slate-500 bg-slate-50"
                              : "border-gray-200"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium">
                                {address.street}, {address.number}
                              </p>
                              <p className="text-sm text-gray-500">
                                {address.neighborhood}, {address.city} -{" "}
                                {address.state}
                              </p>
                              <p className="mt-1 text-sm text-gray-500">
                                CEP: {address.zip_code}
                              </p>
                            </div>
                            {selectedAddress?.id === address.id && (
                              <CheckCircle className="h-5 w-5 text-slate-600" />
                            )}
                          </div>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        onClick={() => setShowAddressForm(true)}
                        className="flex h-auto min-h-[120px] flex-col items-center justify-center gap-2 border-dashed p-4 text-gray-500 hover:border-slate-300 hover:text-slate-600"
                      >
                        <PlusCircle className="h-6 w-6" />
                        <span>Adicionar novo endereço</span>
                      </Button>
                    </div>
                  ) : (
                    <div>
                      {showAddressForm ? (
                        <div className="rounded-lg border p-4">
                          <div className="mb-4 flex items-center justify-between">
                            <h4 className="font-medium">Novo Endereço</h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleCloseAddressForm}
                              className="h-8 text-gray-700 hover:text-gray-800 border border-border"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                          <CreateUserAddressForm
                            user={user}
                            setShowForm={setShowAddressForm}
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                          <MapPin className="mb-2 h-8 w-8 text-gray-400" />
                          <h4 className="mb-2 text-lg font-medium">
                            Nenhum endereço cadastrado
                          </h4>
                          <p className="mb-4 text-sm text-gray-500">
                            Adicione um endereço para facilitar suas compras
                          </p>
                          <Button
                            onClick={() => setShowAddressForm(true)}
                            className="bg-slate-700 text-white hover:bg-slate-800"
                          >
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Adicionar Endereço
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-slate-600" />
                    <h3 className="text-lg font-medium">Telefone</h3>
                  </div>

                  {phones.length > 0 && !showPhoneForm ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {phones.map((phone) => (
                        <div
                          key={phone.id}
                          onClick={() => setSelectedPhone(phone)}
                          className={`cursor-pointer rounded-lg border p-4 transition-all hover:border-slate-300 hover:shadow-sm ${
                            selectedPhone?.id === phone.id
                              ? "border-2 border-slate-500 bg-slate-50"
                              : "border-gray-200"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-lg font-medium">{`+55 ${phone.ddd_code} ${phone.number}`}</p>
                              {phone.number.startsWith("9") && (
                                <Badge className="mt-1 bg-slate-600 text-white hover:bg-slate-700">
                                  WhatsApp
                                </Badge>
                              )}
                            </div>
                            {selectedPhone?.id === phone.id && (
                              <CheckCircle className="h-5 w-5 text-slate-600" />
                            )}
                          </div>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        onClick={() => setShowPhoneForm(true)}
                        className="flex h-auto min-h-[80px] flex-col items-center justify-center gap-2 border-dashed p-4 text-gray-500 hover:border-slate-300 hover:text-slate-600"
                      >
                        <PlusCircle className="h-6 w-6" />
                        <span>Adicionar novo telefone</span>
                      </Button>
                    </div>
                  ) : (
                    <div>
                      {showPhoneForm ? (
                        <div className="rounded-lg border p-4">
                          <div className="mb-4 flex items-center justify-between">
                            <h4 className="font-medium">Novo Telefone</h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleClosePhoneForm}
                              className="h-8 text-gray-700 hover:text-gray-800 border border-border"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                          <CreateUserPhoneForm
                            user={user}
                            setShowForm={setShowPhoneForm}
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                          <Phone className="mb-2 h-8 w-8 text-gray-400" />
                          <h4 className="mb-2 text-lg font-medium">
                            Nenhum telefone cadastrado
                          </h4>
                          <p className="mb-4 text-sm text-gray-500">
                            Adicione um telefone para contato
                          </p>
                          <Button
                            onClick={() => setShowPhoneForm(true)}
                            className="bg-slate-700 text-white hover:bg-slate-800"
                          >
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Adicionar Telefone
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </CardContent>
      </Tabs>
    </Card>
  );
}
