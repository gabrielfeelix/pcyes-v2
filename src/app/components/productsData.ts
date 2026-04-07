export interface Product {
  id: number;
  name: string;
  price: string;
  priceNum: number;
  oldPrice?: string;
  oldPriceNum?: number;
  rating: number;
  reviews: number;
  category: string;
  tags: string[];
  image: string;
  badge?: string;
  brand?: string;
  inStock?: boolean;
  description?: string;
  specs?: { label: string; value: string }[];
  features?: string[];
  images?: string[];
}

export const allProducts: Product[] = [
  {
    id: 1,
    name: "Cadeira Gamer PCYES Mad Racer V8 Turbo Amarela V8TBMADAM",
    price: "R$ 1299,90",
    priceNum: 1299.9,
    oldPrice: "R$ 1624,88",
    oldPriceNum: 1624.875,
    
    rating: 4.7,
    reviews: 101,
    category: "Cadeiras",
    tags: ["Gaming", "Cadeiras"],
    brand: "PCYES",
    image: "https://cdn.oderco.com.br/produtos/210197/06D1CA7F36792E05E0630300A8C051C3",
    images: ["https://cdn.oderco.com.br/produtos/210197/06D1CA7F36792E05E0630300A8C051C3", "https://cdn.oderco.com.br/produtos/210197/06D1CA7F367A2E05E0630300A8C051C3", "https://cdn.oderco.com.br/produtos/210197/06D1CA7F367D2E05E0630300A8C051C3", "https://cdn.oderco.com.br/produtos/210197/06D1CA7F367C2E05E0630300A8C051C3"],
    description: "Cadeira Gamer PCYES Mad Racer V8 Turbo Amarela V8TBMADAM da PCYES, alta qualidade para o seu setup gamer.",
    features: ["Alta durabilidade", "Design moderno", "Qualidade PCYES"],
    specs: [{ label: "Marca", value: "PCYES" }]
  },
  {
    id: 2,
    name: "Cadeira Gamer Ergonômica Sentinel Black Vulcan",
    price: "R$ 1299,90",
    priceNum: 1299.9,
    
    
    rating: 4.8,
    reviews: 212,
    category: "Cadeiras",
    tags: ["Gaming", "Cadeiras"],
    brand: "PCYES",
    image: "https://cdn.oderco.com.br/produtos/212141/138B26D1B2A5AFE5E0630300A8C068DE",
    images: ["https://cdn.oderco.com.br/produtos/212141/138B26D1B2A5AFE5E0630300A8C068DE", "https://cdn.oderco.com.br/produtos/212141/138B26D1B2A6AFE5E0630300A8C068DE"],
    description: "Cadeira Gamer Ergonômica Sentinel Black Vulcan da PCYES, alta qualidade para o seu setup gamer.",
    features: ["Alta durabilidade", "Design moderno", "Qualidade PCYES"],
    specs: [{ label: "Marca", value: "PCYES" }]
  },
  {
    id: 3,
    name: "Cadeira Gamer Ergonômica Sentinel Red Magma PCYes",
    price: "R$ 1299,90",
    priceNum: 1299.9,
    
    
    rating: 4.5,
    reviews: 425,
    category: "Cadeiras",
    tags: ["Gaming", "Cadeiras"],
    brand: "PCYES",
    image: "https://cdn.oderco.com.br/produtos/212143/138B26D1B2AAAFE5E0630300A8C068DE",
    images: ["https://cdn.oderco.com.br/produtos/212143/138B26D1B2AAAFE5E0630300A8C068DE", "https://cdn.oderco.com.br/produtos/212143/138B26D1B2ABAFE5E0630300A8C068DE"],
    description: "Cadeira Gamer Ergonômica Sentinel Red Magma PCYes da PCYES, alta qualidade para o seu setup gamer.",
    features: ["Alta durabilidade", "Design moderno", "Qualidade PCYES"],
    specs: [{ label: "Marca", value: "PCYES" }]
  },
  {
    id: 4,
    name: "Cadeira Gamer Ergonômica Sentinel Colbat Blue PCYes",
    price: "R$ 1299,90",
    priceNum: 1299.9,
    oldPrice: "R$ 1624,88",
    oldPriceNum: 1624.875,
    
    rating: 4.9,
    reviews: 183,
    category: "Cadeiras",
    tags: ["Gaming", "Cadeiras"],
    brand: "PCYES",
    image: "https://cdn.oderco.com.br/produtos/212146/138B26D1B2AFAFE5E0630300A8C068DE",
    images: ["https://cdn.oderco.com.br/produtos/212146/138B26D1B2AFAFE5E0630300A8C068DE", "https://cdn.oderco.com.br/produtos/212146/138B26D1B2B0AFE5E0630300A8C068DE", "https://cdn.oderco.com.br/produtos/212146/138B26D1B2B1AFE5E0630300A8C068DE"],
    description: "Cadeira Gamer Ergonômica Sentinel Colbat Blue PCYes da PCYES, alta qualidade para o seu setup gamer.",
    features: ["Alta durabilidade", "Design moderno", "Qualidade PCYES"],
    specs: [{ label: "Marca", value: "PCYES" }]
  },
  {
    id: 5,
    name: "Cadeira Gamer PCYES Ergonômica Sentinel Mint Green PCSTL-VD",
    price: "R$ 1299,90",
    priceNum: 1299.9,
    
    
    rating: 4.9,
    reviews: 401,
    category: "Cadeiras",
    tags: ["Gaming", "Cadeiras"],
    brand: "PCYES",
    image: "https://cdn.oderco.com.br/produtos/212147/373BBAEAC7BA7463E0630300A8C033BD",
    images: ["https://cdn.oderco.com.br/produtos/212147/373BBAEAC7BA7463E0630300A8C033BD", "https://cdn.oderco.com.br/produtos/212147/373BBAEAC7BB7463E0630300A8C033BD", "https://cdn.oderco.com.br/produtos/212147/373BBAEAC7BC7463E0630300A8C033BD", "https://cdn.oderco.com.br/produtos/212147/373BBAEAC7BD7463E0630300A8C033BD"],
    description: "Cadeira Gamer PCYES Ergonômica Sentinel Mint Green PCSTL-VD da PCYES, alta qualidade para o seu setup gamer.",
    features: ["Alta durabilidade", "Design moderno", "Qualidade PCYES"],
    specs: [{ label: "Marca", value: "PCYES" }]
  },
  {
    id: 6,
    name: "Gabinete Gamer PCYES Forcefield Max Black Vulcan Vidro Temperado",
    price: "R$ 599,90",
    priceNum: 599.9,
    
    
    rating: 4.8,
    reviews: 133,
    category: "Gabinetes",
    tags: ["Gaming", "Gabinetes"],
    brand: "PCYES",
    image: "https://cdn.oderco.com.br/produtos/252557/3F00DCAA20B56D04E0630300A8C06874",
    images: ["https://cdn.oderco.com.br/produtos/252557/3F00DCAA20B56D04E0630300A8C06874", "https://cdn.oderco.com.br/produtos/252557/3F00DCAA20B86D04E0630300A8C06874", "https://cdn.oderco.com.br/produtos/252557/3F00DCAA20B96D04E0630300A8C06874"],
    description: "Gabinete Gamer PCYES Forcefield Max Black Vulcan Vidro Temperado da PCYES, alta qualidade para o seu setup gamer.",
    features: ["Alta durabilidade", "Design moderno", "Qualidade PCYES"],
    specs: [{ label: "Marca", value: "PCYES" }]
  },
  {
    id: 7,
    name: "Gabinete Gamer PCYES Forcefield Black Vulcan Vidro Temperado",
    price: "R$ 599,90",
    priceNum: 599.9,
    oldPrice: "R$ 749,88",
    oldPriceNum: 749.875,
    
    rating: 4.5,
    reviews: 118,
    category: "Gabinetes",
    tags: ["Gaming", "Gabinetes"],
    brand: "PCYES",
    image: "https://cdn.oderco.com.br/produtos/191991/3F00DCAA20E46D04E0630300A8C06874",
    images: ["https://cdn.oderco.com.br/produtos/191991/3F00DCAA20E46D04E0630300A8C06874", "https://cdn.oderco.com.br/produtos/191991/3F00DCAA20E86D04E0630300A8C06874", "https://cdn.oderco.com.br/produtos/191991/3F00DCAA20E66D04E0630300A8C06874"],
    description: "Gabinete Gamer PCYES Forcefield Black Vulcan Vidro Temperado da PCYES, alta qualidade para o seu setup gamer.",
    features: ["Alta durabilidade", "Design moderno", "Qualidade PCYES"],
    specs: [{ label: "Marca", value: "PCYES" }]
  },
  {
    id: 8,
    name: "Gabinete Gamer PCYES Forcefield White Ghost Vidro Temperado",
    price: "R$ 599,90",
    priceNum: 599.9,
    
    
    rating: 4.5,
    reviews: 348,
    category: "Gabinetes",
    tags: ["Gaming", "Gabinetes"],
    brand: "PCYES",
    image: "https://cdn.oderco.com.br/produtos/191992/3F00DCAA20EA6D04E0630300A8C06874",
    images: ["https://cdn.oderco.com.br/produtos/191992/3F00DCAA20EA6D04E0630300A8C06874", "https://cdn.oderco.com.br/produtos/191992/3F00DCAA20EE6D04E0630300A8C06874", "https://cdn.oderco.com.br/produtos/191992/3F00DCAA20EC6D04E0630300A8C06874"],
    description: "Gabinete Gamer PCYES Forcefield White Ghost Vidro Temperado da PCYES, alta qualidade para o seu setup gamer.",
    features: ["Alta durabilidade", "Design moderno", "Qualidade PCYES"],
    specs: [{ label: "Marca", value: "PCYES" }]
  },
  {
    id: 9,
    name: "Gabinete Gamer Set Black Vulcan Vidro Temperado",
    price: "R$ 599,90",
    priceNum: 599.9,
    
    
    rating: 4.9,
    reviews: 56,
    category: "Gabinetes",
    tags: ["Gaming", "Gabinetes"],
    brand: "PCYES",
    image: "https://cdn.oderco.com.br/produtos/191993/3F00DCAA20D96D04E0630300A8C06874",
    images: ["https://cdn.oderco.com.br/produtos/191993/3F00DCAA20D96D04E0630300A8C06874", "https://cdn.oderco.com.br/produtos/191993/3F00DCAA20DC6D04E0630300A8C06874", "https://cdn.oderco.com.br/produtos/191993/3F1792E8B2A233F0E0630300A8C0B19C"],
    description: "Gabinete Gamer Set Black Vulcan Vidro Temperado da PCYES, alta qualidade para o seu setup gamer.",
    features: ["Alta durabilidade", "Design moderno", "Qualidade PCYES"],
    specs: [{ label: "Marca", value: "PCYES" }]
  },
  {
    id: 10,
    name: "Gabinete Gamer Set White Ghost Vidro Lateral",
    price: "R$ 599,90",
    priceNum: 599.9,
    oldPrice: "R$ 749,88",
    oldPriceNum: 749.875,
    
    rating: 4.8,
    reviews: 302,
    category: "Gabinetes",
    tags: ["Gaming", "Gabinetes"],
    brand: "PCYES",
    image: "https://cdn.oderco.com.br/produtos/191994/3F00DCAA20DE6D04E0630300A8C06874",
    images: ["https://cdn.oderco.com.br/produtos/191994/3F00DCAA20DE6D04E0630300A8C06874", "https://cdn.oderco.com.br/produtos/191994/3F00DCAA20DF6D04E0630300A8C06874", "https://cdn.oderco.com.br/produtos/191994/3F00DCAA20E06D04E0630300A8C06874", "https://cdn.oderco.com.br/produtos/191994/3F00DCAA20E16D04E0630300A8C06874"],
    description: "Gabinete Gamer Set White Ghost Vidro Lateral da PCYES, alta qualidade para o seu setup gamer.",
    features: ["Alta durabilidade", "Design moderno", "Qualidade PCYES"],
    specs: [{ label: "Marca", value: "PCYES" }]
  },
  {
    id: 11,
    name: "Mouse Pad Obsidian G2D PCYES Black 500x400mm",
    price: "R$ 149,90",
    priceNum: 149.9,
    
    
    rating: 4.7,
    reviews: 414,
    category: "Periféricos",
    tags: ["Gaming", "Periféricos"],
    brand: "PCYES",
    image: "https://cdn.oderco.com.br/produtos/207001/0813C43B72B06C60E0630300A8C0C984",
    images: ["https://cdn.oderco.com.br/produtos/207001/0813C43B72B06C60E0630300A8C0C984", "https://cdn.oderco.com.br/produtos/207001/0829AC2B7EDA07F2E0630300A8C0ACC5"],
    description: "Mouse Pad Obsidian G2D PCYES Black 500x400mm da PCYES, alta qualidade para o seu setup gamer.",
    features: ["Alta durabilidade", "Design moderno", "Qualidade PCYES"],
    specs: [{ label: "Marca", value: "PCYES" }]
  },
  {
    id: 12,
    name: "Mouse Pad PCYES Gamer Obsidian G3D 500x400 Vidro",
    price: "R$ 149,90",
    priceNum: 149.9,
    
    
    rating: 4.8,
    reviews: 174,
    category: "Periféricos",
    tags: ["Gaming", "Periféricos"],
    brand: "PCYES",
    image: "https://cdn.oderco.com.br/produtos/207002/FD6585990BA79601E0530300A8C09D90",
    images: ["https://cdn.oderco.com.br/produtos/207002/FD6585990BA79601E0530300A8C09D90", "https://cdn.oderco.com.br/produtos/207002/0829AC2B7EE107F2E0630300A8C0ACC5"],
    description: "Mouse Pad PCYES Gamer Obsidian G3D 500x400 Vidro da PCYES, alta qualidade para o seu setup gamer.",
    features: ["Alta durabilidade", "Design moderno", "Qualidade PCYES"],
    specs: [{ label: "Marca", value: "PCYES" }]
  },
  {
    id: 13,
    name: "Mouse Pad Obsidian G4D PCYES Purple 500x400mm",
    price: "R$ 149,90",
    priceNum: 149.9,
    oldPrice: "R$ 187,38",
    oldPriceNum: 187.375,
    
    rating: 4.7,
    reviews: 135,
    category: "Periféricos",
    tags: ["Gaming", "Periféricos"],
    brand: "PCYES",
    image: "https://cdn.oderco.com.br/produtos/230651/1A89C644F4C1D041E0630300A8C0BD5D",
    images: ["https://cdn.oderco.com.br/produtos/230651/1A89C644F4C1D041E0630300A8C0BD5D", "https://cdn.oderco.com.br/produtos/230651/1A89C644F4C4D041E0630300A8C0BD5D"],
    description: "Mouse Pad Obsidian G4D PCYES Purple 500x400mm da PCYES, alta qualidade para o seu setup gamer.",
    features: ["Alta durabilidade", "Design moderno", "Qualidade PCYES"],
    specs: [{ label: "Marca", value: "PCYES" }]
  },
  {
    id: 14,
    name: "Mouse Pad Obsidian G2D Extended PCYES Black 900x420mm",
    price: "R$ 149,90",
    priceNum: 149.9,
    
    
    rating: 4.7,
    reviews: 191,
    category: "Periféricos",
    tags: ["Gaming", "Periféricos"],
    brand: "PCYES",
    image: "https://cdn.oderco.com.br/produtos/230652/3FA519DFE3CDF8BBE0630300A8C0CD12",
    images: ["https://cdn.oderco.com.br/produtos/230652/3FA519DFE3CDF8BBE0630300A8C0CD12", "https://cdn.oderco.com.br/produtos/230652/3FA519DFE3D0F8BBE0630300A8C0CD12"],
    description: "Mouse Pad Obsidian G2D Extended PCYES Black 900x420mm da PCYES, alta qualidade para o seu setup gamer.",
    features: ["Alta durabilidade", "Design moderno", "Qualidade PCYES"],
    specs: [{ label: "Marca", value: "PCYES" }]
  },
  {
    id: 15,
    name: "Mouse Pad Gamer Maze PCYES White Ghost Extended 900x420mm",
    price: "R$ 149,90",
    priceNum: 149.9,
    
    
    rating: 4.6,
    reviews: 228,
    category: "Periféricos",
    tags: ["Gaming", "Periféricos"],
    brand: "PCYES",
    image: "https://cdn.oderco.com.br/produtos/268133/3FA5BA5A4893B008E0630300A8C0D3E2",
    images: ["https://cdn.oderco.com.br/produtos/268133/3FA5BA5A4893B008E0630300A8C0D3E2", "https://cdn.oderco.com.br/produtos/268133/3FA5BA5A4896B008E0630300A8C0D3E2"],
    description: "Mouse Pad Gamer Maze PCYES White Ghost Extended 900x420mm da PCYES, alta qualidade para o seu setup gamer.",
    features: ["Alta durabilidade", "Design moderno", "Qualidade PCYES"],
    specs: [{ label: "Marca", value: "PCYES" }]
  },
  {
    id: 16,
    name: "Mouse PCYES Gamer Basaran Black Vulcan RGB 12400DPI Silent Click",
    price: "R$ 249,90",
    priceNum: 249.9,
    oldPrice: "R$ 312,38",
    oldPriceNum: 312.375,
    
    rating: 4.5,
    reviews: 313,
    category: "Periféricos",
    tags: ["Gaming", "Periféricos"],
    brand: "PCYES",
    image: "https://cdn.oderco.com.br/produtos/199399/3F2E42F714F7871CE0630300A8C048F6",
    images: ["https://cdn.oderco.com.br/produtos/199399/3F2E42F714F7871CE0630300A8C048F6", "https://cdn.oderco.com.br/produtos/199399/3F2E42F714F8871CE0630300A8C048F6"],
    description: "Mouse PCYES Gamer Basaran Black Vulcan RGB 12400DPI Silent Click da PCYES, alta qualidade para o seu setup gamer.",
    features: ["Alta durabilidade", "Design moderno", "Qualidade PCYES"],
    specs: [{ label: "Marca", value: "PCYES" }]
  },
  {
    id: 17,
    name: "Mouse Gamer Sem Fio PCYES Basaran Stealth White Ghost 10000 DPI RGB",
    price: "R$ 249,90",
    priceNum: 249.9,
    
    
    rating: 4.5,
    reviews: 133,
    category: "Periféricos",
    tags: ["Gaming", "Periféricos"],
    brand: "PCYES",
    image: "https://cdn.oderco.com.br/produtos/199420/FBD0003333EA8CF3E0530300A8C0E348",
    images: ["https://cdn.oderco.com.br/produtos/199420/FBD0003333EA8CF3E0530300A8C0E348", "https://cdn.oderco.com.br/produtos/199420/400A4BB249A32EC2E0630300A8C02A2C"],
    description: "Mouse Gamer Sem Fio PCYES Basaran Stealth White Ghost 10000 DPI RGB da PCYES, alta qualidade para o seu setup gamer.",
    features: ["Alta durabilidade", "Design moderno", "Qualidade PCYES"],
    specs: [{ label: "Marca", value: "PCYES" }]
  },
  {
    id: 18,
    name: "Mouse PCYES Gamer Gaius RGB 12400DPI 6 Botões",
    price: "R$ 249,90",
    priceNum: 249.9,
    
    
    rating: 4.7,
    reviews: 345,
    category: "Periféricos",
    tags: ["Gaming", "Periféricos"],
    brand: "PCYES",
    image: "https://cdn.oderco.com.br/produtos/199396/3F2E42F714EB871CE0630300A8C048F6",
    images: ["https://cdn.oderco.com.br/produtos/199396/3F2E42F714EB871CE0630300A8C048F6", "https://cdn.oderco.com.br/produtos/199396/3F2E42F714EC871CE0630300A8C048F6"],
    description: "Mouse PCYES Gamer Gaius RGB 12400DPI 6 Botões da PCYES, alta qualidade para o seu setup gamer.",
    features: ["Alta durabilidade", "Design moderno", "Qualidade PCYES"],
    specs: [{ label: "Marca", value: "PCYES" }]
  },
  {
    id: 19,
    name: "Mouse PCYES Gamer Valus RGB 12400DPI 8 Botões",
    price: "R$ 249,90",
    priceNum: 249.9,
    oldPrice: "R$ 312,38",
    oldPriceNum: 312.375,
    
    rating: 4.6,
    reviews: 246,
    category: "Periféricos",
    tags: ["Gaming", "Periféricos"],
    brand: "PCYES",
    image: "https://cdn.oderco.com.br/produtos/199397/3F2E42F714F1871CE0630300A8C048F6",
    images: ["https://cdn.oderco.com.br/produtos/199397/3F2E42F714F1871CE0630300A8C048F6", "https://cdn.oderco.com.br/produtos/199397/3F2E42F714F2871CE0630300A8C048F6"],
    description: "Mouse PCYES Gamer Valus RGB 12400DPI 8 Botões da PCYES, alta qualidade para o seu setup gamer.",
    features: ["Alta durabilidade", "Design moderno", "Qualidade PCYES"],
    specs: [{ label: "Marca", value: "PCYES" }]
  },
  {
    id: 20,
    name: "Mouse Gamer Argus PCYES RGB 12400DPI 8 Botões",
    price: "R$ 249,90",
    priceNum: 249.9,
    
    
    rating: 4.7,
    reviews: 71,
    category: "Periféricos",
    tags: ["Gaming", "Periféricos"],
    brand: "PCYES",
    image: "https://cdn.oderco.com.br/produtos/253933/3F69B8315645C752E0630300A8C059F1",
    images: ["https://cdn.oderco.com.br/produtos/253933/3F69B8315645C752E0630300A8C059F1", "https://cdn.oderco.com.br/produtos/253933/3F69B8315646C752E0630300A8C059F1"],
    description: "Mouse Gamer Argus PCYES RGB 12400DPI 8 Botões da PCYES, alta qualidade para o seu setup gamer.",
    features: ["Alta durabilidade", "Design moderno", "Qualidade PCYES"],
    specs: [{ label: "Marca", value: "PCYES" }]
  },
  {
    id: 21,
    name: "Teclado Mecânico PCYES Kuromori White Ghost Blue Switch",
    price: "R$ 399,90",
    priceNum: 399.9,
    
    badge: "BLUE SWITCH",
    rating: 4.5,
    reviews: 67,
    category: "Periféricos",
    tags: ["Gaming", "Periféricos"],
    brand: "PCYES",
    image: "https://cdn.oderco.com.br/produtos/246231/3FA2133D8BCE330EE0630300A8C0F6B9",
    images: ["https://cdn.oderco.com.br/produtos/246231/3FA2133D8BCE330EE0630300A8C0F6B9"],
    description: "Teclado Mecânico PCYES Kuromori White Ghost Blue Switch da PCYES, alta qualidade para o seu setup gamer.",
    features: ["Alta durabilidade", "Design moderno", "Qualidade PCYES"],
    specs: [{ label: "Marca", value: "PCYES" }]
  },
  {
    id: 22,
    name: "Teclado Mecânico PCYES Kuromori Black Vulcan Blue Switch",
    price: "R$ 399,90",
    priceNum: 399.9,
    oldPrice: "R$ 499,88",
    oldPriceNum: 499.875,
    badge: "BLUE SWITCH",
    rating: 4.8,
    reviews: 232,
    category: "Periféricos",
    tags: ["Gaming", "Periféricos"],
    brand: "PCYES",
    image: "https://cdn.oderco.com.br/produtos/199408/3FA0B95161429B0EE0630300A8C04A18",
    images: ["https://cdn.oderco.com.br/produtos/199408/3FA0B95161429B0EE0630300A8C04A18"],
    description: "Teclado Mecânico PCYES Kuromori Black Vulcan Blue Switch da PCYES, alta qualidade para o seu setup gamer.",
    features: ["Alta durabilidade", "Design moderno", "Qualidade PCYES"],
    specs: [{ label: "Marca", value: "PCYES" }]
  },
  {
    id: 23,
    name: "Teclado Mecânico PCYES Kuromori Black Vulcan Red Switch",
    price: "R$ 399,90",
    priceNum: 399.9,
    
    badge: "RED SWITCH",
    rating: 4.5,
    reviews: 184,
    category: "Periféricos",
    tags: ["Gaming", "Periféricos"],
    brand: "PCYES",
    image: "https://cdn.oderco.com.br/produtos/199409/3FA2133D8BC8330EE0630300A8C0F6B9",
    images: ["https://cdn.oderco.com.br/produtos/199409/3FA2133D8BC8330EE0630300A8C0F6B9"],
    description: "Teclado Mecânico PCYES Kuromori Black Vulcan Red Switch da PCYES, alta qualidade para o seu setup gamer.",
    features: ["Alta durabilidade", "Design moderno", "Qualidade PCYES"],
    specs: [{ label: "Marca", value: "PCYES" }]
  },
  {
    id: 24,
    name: "Teclado Mecânico PCYES Kuromori White Ghost Red Switch",
    price: "R$ 399,90",
    priceNum: 399.9,
    
    badge: "RED SWITCH",
    rating: 4.6,
    reviews: 151,
    category: "Periféricos",
    tags: ["Gaming", "Periféricos"],
    brand: "PCYES",
    image: "https://cdn.oderco.com.br/produtos/246230/3FA0FF24E03F4B06E0630300A8C0A92F",
    images: ["https://cdn.oderco.com.br/produtos/246230/3FA0FF24E03F4B06E0630300A8C0A92F"],
    description: "Teclado Mecânico PCYES Kuromori White Ghost Red Switch da PCYES, alta qualidade para o seu setup gamer.",
    features: ["Alta durabilidade", "Design moderno", "Qualidade PCYES"],
    specs: [{ label: "Marca", value: "PCYES" }]
  },
  {
    id: 25,
    name: "Teclado Mecânico PCYES Kuromori Voyager Edition Blue Switch",
    price: "R$ 399,90",
    priceNum: 399.9,
    oldPrice: "R$ 499,88",
    oldPriceNum: 499.875,
    badge: "BLUE SWITCH",
    rating: 4.9,
    reviews: 287,
    category: "Periféricos",
    tags: ["Gaming", "Periféricos"],
    brand: "PCYES",
    image: "https://cdn.oderco.com.br/produtos/286135/25C7064E389DE6C2E0630300A8C0EDA5",
    images: ["https://cdn.oderco.com.br/produtos/286135/25C7064E389DE6C2E0630300A8C0EDA5"],
    description: "Teclado Mecânico PCYES Kuromori Voyager Edition Blue Switch da PCYES, alta qualidade para o seu setup gamer.",
    features: ["Alta durabilidade", "Design moderno", "Qualidade PCYES"],
    specs: [{ label: "Marca", value: "PCYES" }]
  },
  {
    id: 26,
    name: "Suporte Para Microfone PCYES Streaming Podcast Braço Articulado",
    price: "R$ 199,90",
    priceNum: 199.9,
    
    
    rating: 4.8,
    reviews: 140,
    category: "Streaming",
    tags: ["Gaming", "Streaming"],
    brand: "PCYES",
    image: "https://cdn.oderco.com.br/produtos/111551/4004C0883B7321AAE0630300A8C0B09E",
    images: ["https://cdn.oderco.com.br/produtos/111551/4004C0883B7321AAE0630300A8C0B09E"],
    description: "Suporte Para Microfone PCYES Streaming Podcast Braço Articulado da PCYES, alta qualidade para o seu setup gamer.",
    features: ["Alta durabilidade", "Design moderno", "Qualidade PCYES"],
    specs: [{ label: "Marca", value: "PCYES" }]
  },
  {
    id: 27,
    name: "Suporte de Parede para Monitor PCYES 17\"-32\" Pistão a Gás",
    price: "R$ 299,90",
    priceNum: 299.9,
    
    
    rating: 4.9,
    reviews: 148,
    category: "Monitores",
    tags: ["Gaming", "Monitores"],
    brand: "PCYES",
    image: "https://cdn.oderco.com.br/produtos/192831/401821A4EDB6BD3AE0630300A8C04C48",
    images: ["https://cdn.oderco.com.br/produtos/192831/401821A4EDB6BD3AE0630300A8C04C48"],
    description: "Suporte de Parede para Monitor PCYES 17\"-32\" Pistão a Gás da PCYES, alta qualidade para o seu setup gamer.",
    features: ["Alta durabilidade", "Design moderno", "Qualidade PCYES"],
    specs: [{ label: "Marca", value: "PCYES" }]
  },
  {
    id: 28,
    name: "Suporte Articulado Para Monitor PCYES 17-32 Pistão a Gás USB Áudio",
    price: "R$ 299,90",
    priceNum: 299.9,
    oldPrice: "R$ 374,88",
    oldPriceNum: 374.875,
    
    rating: 4.9,
    reviews: 305,
    category: "Monitores",
    tags: ["Gaming", "Monitores"],
    brand: "PCYES",
    image: "https://cdn.oderco.com.br/produtos/194261/401821A4EDACBD3AE0630300A8C04C48",
    images: ["https://cdn.oderco.com.br/produtos/194261/401821A4EDACBD3AE0630300A8C04C48"],
    description: "Suporte Articulado Para Monitor PCYES 17-32 Pistão a Gás USB Áudio da PCYES, alta qualidade para o seu setup gamer.",
    features: ["Alta durabilidade", "Design moderno", "Qualidade PCYES"],
    specs: [{ label: "Marca", value: "PCYES" }]
  },
  {
    id: 29,
    name: "Suporte Articulado para Monitor PCYES Branco 17\"-32\" com USB 3.0",
    price: "R$ 299,90",
    priceNum: 299.9,
    
    
    rating: 4.7,
    reviews: 121,
    category: "Monitores",
    tags: ["Gaming", "Monitores"],
    brand: "PCYES",
    image: "https://cdn.oderco.com.br/produtos/194262/401821A4EDB1BD3AE0630300A8C04C48",
    images: ["https://cdn.oderco.com.br/produtos/194262/401821A4EDB1BD3AE0630300A8C04C48"],
    description: "Suporte Articulado para Monitor PCYES Branco 17\"-32\" com USB 3.0 da PCYES, alta qualidade para o seu setup gamer.",
    features: ["Alta durabilidade", "Design moderno", "Qualidade PCYES"],
    specs: [{ label: "Marca", value: "PCYES" }]
  },
  {
    id: 30,
    name: "Suporte Para Setup Studio PCYES 4 em 1 Monitor 17-32",
    price: "R$ 299,90",
    priceNum: 299.9,
    
    
    rating: 4.6,
    reviews: 342,
    category: "Monitores",
    tags: ["Gaming", "Monitores"],
    brand: "PCYES",
    image: "https://cdn.oderco.com.br/produtos/195241/401821A4EDA7BD3AE0630300A8C04C48",
    images: ["https://cdn.oderco.com.br/produtos/195241/401821A4EDA7BD3AE0630300A8C04C48"],
    description: "Suporte Para Setup Studio PCYES 4 em 1 Monitor 17-32 da PCYES, alta qualidade para o seu setup gamer.",
    features: ["Alta durabilidade", "Design moderno", "Qualidade PCYES"],
    specs: [{ label: "Marca", value: "PCYES" }]
  },
  {
    id: 31,
    name: "GT 710 2GB DDR3 Low Profile",
    price: "R$ 499,90",
    priceNum: 499.9,
    oldPrice: "R$ 624,88",
    oldPriceNum: 624.875,
    
    rating: 4.6,
    reviews: 171,
    category: "Placas de Vídeo",
    tags: ["Gaming", "Placas de Vídeo"],
    brand: "PCYES",
    image: "https://cdn.oderco.com.br/produtos/282767/2D04A9618C5EF13EE0630300A8C0554C",
    images: ["https://cdn.oderco.com.br/produtos/282767/2D04A9618C5EF13EE0630300A8C0554C", "https://cdn.oderco.com.br/produtos/282767/2D04A9618C5FF13EE0630300A8C0554C", "https://cdn.oderco.com.br/produtos/282767/2D04A9618C60F13EE0630300A8C0554C", "https://cdn.oderco.com.br/produtos/282767/2D04A9618C62F13EE0630300A8C0554C"],
    description: "GT 710 2GB DDR3 Low Profile da PCYES, alta qualidade para o seu setup gamer.",
    features: ["Alta durabilidade", "Design moderno", "Qualidade PCYES"],
    specs: [{ label: "Marca", value: "PCYES" }]
  },
  {
    id: 32,
    name: "GT 740 2GB GDDR5 128 Bits",
    price: "R$ 499,90",
    priceNum: 499.9,
    
    
    rating: 4.5,
    reviews: 296,
    category: "Placas de Vídeo",
    tags: ["Gaming", "Placas de Vídeo"],
    brand: "PCYES",
    image: "https://cdn.oderco.com.br/produtos/259330/189437062258193CE0630300A8C08D4D",
    images: ["https://cdn.oderco.com.br/produtos/259330/189437062258193CE0630300A8C08D4D"],
    description: "GT 740 2GB GDDR5 128 Bits da PCYES, alta qualidade para o seu setup gamer.",
    features: ["Alta durabilidade", "Design moderno", "Qualidade PCYES"],
    specs: [{ label: "Marca", value: "PCYES" }]
  },
  {
    id: 33,
    name: "GT740 4GB GDDR5 128 Bits",
    price: "R$ 499,90",
    priceNum: 499.9,
    
    
    rating: 4.8,
    reviews: 65,
    category: "Placas de Vídeo",
    tags: ["Gaming", "Placas de Vídeo"],
    brand: "PCYES",
    image: "https://cdn.oderco.com.br/produtos/261071/1982E845579812A0E0630300A8C04222",
    images: ["https://cdn.oderco.com.br/produtos/261071/1982E845579812A0E0630300A8C04222"],
    description: "GT740 4GB GDDR5 128 Bits da PCYES, alta qualidade para o seu setup gamer.",
    features: ["Alta durabilidade", "Design moderno", "Qualidade PCYES"],
    specs: [{ label: "Marca", value: "PCYES" }]
  },
  {
    id: 34,
    name: "GT730 2GB DDR5 64 Bits Edge Low Profile",
    price: "R$ 499,90",
    priceNum: 499.9,
    oldPrice: "R$ 624,88",
    oldPriceNum: 624.875,
    
    rating: 4.5,
    reviews: 291,
    category: "Placas de Vídeo",
    tags: ["Gaming", "Placas de Vídeo"],
    brand: "PCYES",
    image: "https://cdn.oderco.com.br/produtos/261089/1982E845579A12A0E0630300A8C04222",
    images: ["https://cdn.oderco.com.br/produtos/261089/1982E845579A12A0E0630300A8C04222", "https://cdn.oderco.com.br/produtos/261089/25C94E9521803DCCE0630300A8C00F3E"],
    description: "GT730 2GB DDR5 64 Bits Edge Low Profile da PCYES, alta qualidade para o seu setup gamer.",
    features: ["Alta durabilidade", "Design moderno", "Qualidade PCYES"],
    specs: [{ label: "Marca", value: "PCYES" }]
  },
  {
    id: 35,
    name: "GT730 4GB GDDR5 Low Profile Single Fan",
    price: "R$ 499,90",
    priceNum: 499.9,
    
    
    rating: 4.9,
    reviews: 53,
    category: "Placas de Vídeo",
    tags: ["Gaming", "Placas de Vídeo"],
    brand: "PCYES",
    image: "https://cdn.oderco.com.br/produtos/261073/1982E845579912A0E0630300A8C04222",
    images: ["https://cdn.oderco.com.br/produtos/261073/1982E845579912A0E0630300A8C04222", "https://cdn.oderco.com.br/produtos/261073/25C94E9521893DCCE0630300A8C00F3E"],
    description: "GT730 4GB GDDR5 Low Profile Single Fan da PCYES, alta qualidade para o seu setup gamer.",
    features: ["Alta durabilidade", "Design moderno", "Qualidade PCYES"],
    specs: [{ label: "Marca", value: "PCYES" }]
  },
  {
    id: 36,
    name: "SSD PCYES 256GB M.2 NVMe PCIe 3.0x4",
    price: "R$ 299,90",
    priceNum: 299.9,
    
    
    rating: 4.9,
    reviews: 89,
    category: "SSD e HD",
    tags: ["Gaming", "SSD e HD"],
    brand: "PCYES",
    image: "https://cdn.oderco.com.br/produtos/202394/401A241D79BE4FABE0630300A8C0903C",
    images: ["https://cdn.oderco.com.br/produtos/202394/401A241D79BE4FABE0630300A8C0903C"],
    description: "SSD PCYES 256GB M.2 NVMe PCIe 3.0x4 da PCYES, alta qualidade para o seu setup gamer.",
    features: ["Alta durabilidade", "Design moderno", "Qualidade PCYES"],
    specs: [{ label: "Marca", value: "PCYES" }]
  },
  {
    id: 37,
    name: "SSD PCYES 512GB M.2 NVMe 2200MB/s",
    price: "R$ 299,90",
    priceNum: 299.9,
    oldPrice: "R$ 374,88",
    oldPriceNum: 374.875,
    
    rating: 4.9,
    reviews: 182,
    category: "SSD e HD",
    tags: ["Gaming", "SSD e HD"],
    brand: "PCYES",
    image: "https://cdn.oderco.com.br/produtos/202395/4520E92D66A8C021E0630300A8C02B6F",
    images: ["https://cdn.oderco.com.br/produtos/202395/4520E92D66A8C021E0630300A8C02B6F"],
    description: "SSD PCYES 512GB M.2 NVMe 2200MB/s da PCYES, alta qualidade para o seu setup gamer.",
    features: ["Alta durabilidade", "Design moderno", "Qualidade PCYES"],
    specs: [{ label: "Marca", value: "PCYES" }]
  },
  {
    id: 38,
    name: "SSD PCYES 512GB SATA III 2,5\"",
    price: "R$ 299,90",
    priceNum: 299.9,
    
    
    rating: 4.6,
    reviews: 299,
    category: "SSD e HD",
    tags: ["Gaming", "SSD e HD"],
    brand: "PCYES",
    image: "https://cdn.oderco.com.br/produtos/192060/401A241D79A54FABE0630300A8C0903C",
    images: ["https://cdn.oderco.com.br/produtos/192060/401A241D79A54FABE0630300A8C0903C"],
    description: "SSD PCYES 512GB SATA III 2,5\" da PCYES, alta qualidade para o seu setup gamer.",
    features: ["Alta durabilidade", "Design moderno", "Qualidade PCYES"],
    specs: [{ label: "Marca", value: "PCYES" }]
  },
  {
    id: 39,
    name: "SSD PCYES 1TB SATA III 2.5",
    price: "R$ 299,90",
    priceNum: 299.9,
    
    
    rating: 4.9,
    reviews: 150,
    category: "SSD e HD",
    tags: ["Gaming", "SSD e HD"],
    brand: "PCYES",
    image: "https://cdn.oderco.com.br/produtos/202396/401A241D79B44FABE0630300A8C0903C",
    images: ["https://cdn.oderco.com.br/produtos/202396/401A241D79B44FABE0630300A8C0903C"],
    description: "SSD PCYES 1TB SATA III 2.5 da PCYES, alta qualidade para o seu setup gamer.",
    features: ["Alta durabilidade", "Design moderno", "Qualidade PCYES"],
    specs: [{ label: "Marca", value: "PCYES" }]
  },
  {
    id: 40,
    name: "SSD PCYES 128GB SATA III",
    price: "R$ 299,90",
    priceNum: 299.9,
    oldPrice: "R$ 374,88",
    oldPriceNum: 374.875,
    
    rating: 4.5,
    reviews: 345,
    category: "SSD e HD",
    tags: ["Gaming", "SSD e HD"],
    brand: "PCYES",
    image: "https://cdn.oderco.com.br/produtos/157400/401A241D79AF4FABE0630300A8C0903C",
    images: ["https://cdn.oderco.com.br/produtos/157400/401A241D79AF4FABE0630300A8C0903C"],
    description: "SSD PCYES 128GB SATA III da PCYES, alta qualidade para o seu setup gamer.",
    features: ["Alta durabilidade", "Design moderno", "Qualidade PCYES"],
    specs: [{ label: "Marca", value: "PCYES" }]
  },
  {
    id: 41,
    name: "Cooler para Processador PCYES Nótus ST Intel TDP 65W",
    price: "R$ 349,90",
    priceNum: 349.9,
    
    
    rating: 4.7,
    reviews: 349,
    category: "Refrigeração",
    tags: ["Gaming", "Refrigeração"],
    brand: "PCYES",
    image: "https://cdn.oderco.com.br/produtos/32846/3F9F1AE4EDB8A0D1E0630300A8C05422",
    images: ["https://cdn.oderco.com.br/produtos/32846/3F9F1AE4EDB8A0D1E0630300A8C05422"],
    description: "Cooler para Processador PCYES Nótus ST Intel TDP 65W da PCYES, alta qualidade para o seu setup gamer.",
    features: ["Alta durabilidade", "Design moderno", "Qualidade PCYES"],
    specs: [{ label: "Marca", value: "PCYES" }]
  },
  {
    id: 42,
    name: "Water Cooler PCYES Sangue Frio 3 White Ghost 120mm",
    price: "R$ 349,90",
    priceNum: 349.9,
    
    
    rating: 4.9,
    reviews: 288,
    category: "Refrigeração",
    tags: ["Gaming", "Refrigeração"],
    brand: "PCYES",
    image: "https://cdn.oderco.com.br/produtos/210397/3D7FF909C0F830B1E0630300A8C042C0",
    images: ["https://cdn.oderco.com.br/produtos/210397/3D7FF909C0F830B1E0630300A8C042C0"],
    description: "Water Cooler PCYES Sangue Frio 3 White Ghost 120mm da PCYES, alta qualidade para o seu setup gamer.",
    features: ["Alta durabilidade", "Design moderno", "Qualidade PCYES"],
    specs: [{ label: "Marca", value: "PCYES" }]
  },
  {
    id: 43,
    name: "Water Cooler PCYES Sangue Frio 3 ARGB White Ghost 120mm",
    price: "R$ 349,90",
    priceNum: 349.9,
    oldPrice: "R$ 437,38",
    oldPriceNum: 437.375,
    
    rating: 4.6,
    reviews: 341,
    category: "Refrigeração",
    tags: ["Gaming", "Refrigeração"],
    brand: "PCYES",
    image: "https://cdn.oderco.com.br/produtos/210410/3D7292BA47F8A9BFE0630300A8C09253",
    images: ["https://cdn.oderco.com.br/produtos/210410/3D7292BA47F8A9BFE0630300A8C09253"],
    description: "Water Cooler PCYES Sangue Frio 3 ARGB White Ghost 120mm da PCYES, alta qualidade para o seu setup gamer.",
    features: ["Alta durabilidade", "Design moderno", "Qualidade PCYES"],
    specs: [{ label: "Marca", value: "PCYES" }]
  },
  {
    id: 44,
    name: "Pasta Térmica Nitrogen Pro 1,5g",
    price: "R$ 49,90",
    priceNum: 49.9,
    
    
    rating: 4.8,
    reviews: 329,
    category: "Refrigeração",
    tags: ["Gaming", "Refrigeração"],
    brand: "PCYES",
    image: "https://cdn.oderco.com.br/produtos/155239/3F8ADEAEEF3B3746E0630300A8C00BDC",
    images: ["https://cdn.oderco.com.br/produtos/155239/3F8ADEAEEF3B3746E0630300A8C00BDC"],
    description: "Pasta Térmica Nitrogen Pro 1,5g da PCYES, alta qualidade para o seu setup gamer.",
    features: ["Alta durabilidade", "Design moderno", "Qualidade PCYES"],
    specs: [{ label: "Marca", value: "PCYES" }]
  },
  {
    id: 45,
    name: "Pasta Térmica Nitrogen Pro 4g",
    price: "R$ 49,90",
    priceNum: 49.9,
    
    
    rating: 4.8,
    reviews: 230,
    category: "Refrigeração",
    tags: ["Gaming", "Refrigeração"],
    brand: "PCYES",
    image: "https://cdn.oderco.com.br/produtos/156177/3F8ADEAEEF443746E0630300A8C00BDC",
    images: ["https://cdn.oderco.com.br/produtos/156177/3F8ADEAEEF443746E0630300A8C00BDC"],
    description: "Pasta Térmica Nitrogen Pro 4g da PCYES, alta qualidade para o seu setup gamer.",
    features: ["Alta durabilidade", "Design moderno", "Qualidade PCYES"],
    specs: [{ label: "Marca", value: "PCYES" }]
  },
];

export const categories = ["Gabinetes", "Periféricos", "Monitores", "Cadeiras", "Streaming", "Placas de Vídeo", "SSD e HD", "Refrigeração"];
export const allTags = ["Gaming", "RGB", "Wireless", "Streaming", "Escritório", "Placas de Vídeo", "SSD e HD", "Refrigeração"];
export const brands = ["PCYES"];
