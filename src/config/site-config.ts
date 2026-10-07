export interface CategoryItem {
  id: string;
  name: string;
  shortName: string;
}

export interface SiteConfiguration {
  brand: {
    name: string;
    tagline: string;
    description: string;
    domain: string;
    instagramUrl: string;
  };
  whatsapp: {
    phoneNumber: string;
    displayPhoneNumber: string;
    welcomeMessage: string;
    orderPrefixMessage: string;
    orderFooterMessage: string;
  };
  currency: {
    symbol: string;
    code: string;
    position: "prefix" | "suffix";
    decimals: number;
    thousandsSeparator: string;
  };
  business: {
    address: string;
    hours: string;
    deliveryInfo: string;
  };
  admin: {
    defaultPin: string;
    collectionPrefix: string;
  };
  categories: CategoryItem[];
}

export const siteConfig: SiteConfiguration = {
  brand: {
    name: "Ñami Ñami",
    tagline: "El sabor de lo auténtico.",
    description:
      "Catálogo exclusivo de yerbas selectas, mates artesanales, latas de colección, vinos argentinos y delicias tradicionales.",
    domain: "naminami.southopenlabs.com",
    instagramUrl: "https://instagram.com/",
  },
  whatsapp: {
    phoneNumber: "595985623486",
    displayPhoneNumber: "+595 985 623 486",
    welcomeMessage: "¡Hola! Estoy visitando la tienda Ñami Ñami y quisiera consultar sobre sus productos.",
    orderPrefixMessage: "*Hola Ñami Ñami, quiero realizar el siguiente pedido:* \n\n",
    orderFooterMessage: "\n*¿Tienen disponibilidad y cómo coordinamos el pago y la entrega?*",
  },
  currency: {
    symbol: "Gs.",
    code: "PYG",
    position: "suffix",
    decimals: 0,
    thousandsSeparator: ".",
  },
  business: {
    address: "Asunción, Paraguay",
    hours: "Lunes a Sábado de 08:30 a 19:30",
    deliveryInfo: "Envíos a todo el país o retiro coordinado por WhatsApp.",
  },
  admin: {
    defaultPin: "1234",
    collectionPrefix: "naminami_",
  },
  categories: [
    { id: "todos", name: "Todos los productos", shortName: "Todos" },
    { id: "yerba-mate", name: "Yerba Mate", shortName: "Yerbas" },
    { id: "latas-y-termos", name: "Latas y Termos", shortName: "Latas & Termos" },
    { id: "mates-y-bombillas", name: "Mates y Bombillas", shortName: "Mates & Bombillas" },
    { id: "combos", name: "Combos Especiales", shortName: "Combos" },
    { id: "vinos", name: "Vinos Argentinos", shortName: "Vinos" },
    { id: "alfajores-y-dulces", name: "Alfajores y Dulces", shortName: "Dulces" },
  ],
};
