interface AddressInfoViaCEPResponse {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  localidade: string
  uf: string
  estado: string
  regiao: string
  ibge: string
  gia: string
  ddd: string
  siafi: string
  unidade: string
}

export async function addressInfoViaCEP(
  cep: string,
): Promise<AddressInfoViaCEPResponse | { message: string }> {
  const url = `https://viacep.com.br/ws/${cep}/json/`

  try {
    const response = await fetch(url, {
      method: 'GET',
    })

    if (!response.ok) {
      return { message: 'CEP Inválido, tente novamente' }
    }

    const {
      cep,
      uf,
      localidade,
      logradouro,
      complemento,
      unidade,
      bairro,
      estado,
      regiao,
      ibge,
      gia,
      ddd,
      siafi,
    } = await response.json()

    return {
      cep,
      uf,
      localidade,
      logradouro,
      complemento,
      unidade,
      bairro,
      estado,
      regiao,
      ibge,
      gia,
      ddd,
      siafi,
    }
  } catch (error) {
    return { message: JSON.stringify(error) }
  }
}
