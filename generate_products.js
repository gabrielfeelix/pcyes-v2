import fs from 'fs';

const products = [
  { name: "Cadeira Gamer PCYES Mad Racer V8 Turbo Amarela V8TBMADAM", cat: "Cadeiras", img: "https://cdn.oderco.com.br/produtos/210197/06D1CA7F36792E05E0630300A8C051C3", sec: ["https://cdn.oderco.com.br/produtos/210197/06D1CA7F367A2E05E0630300A8C051C3", "https://cdn.oderco.com.br/produtos/210197/06D1CA7F367D2E05E0630300A8C051C3", "https://cdn.oderco.com.br/produtos/210197/06D1CA7F367C2E05E0630300A8C051C3"] },
  { name: "Cadeira Gamer Ergonômica Sentinel Black Vulcan", cat: "Cadeiras", img: "https://cdn.oderco.com.br/produtos/212141/138B26D1B2A5AFE5E0630300A8C068DE", sec: ["https://cdn.oderco.com.br/produtos/212141/138B26D1B2A6AFE5E0630300A8C068DE"] },
  { name: "Cadeira Gamer Ergonômica Sentinel Red Magma PCYes", cat: "Cadeiras", img: "https://cdn.oderco.com.br/produtos/212143/138B26D1B2AAAFE5E0630300A8C068DE", sec: ["https://cdn.oderco.com.br/produtos/212143/138B26D1B2ABAFE5E0630300A8C068DE"] },
  { name: "Cadeira Gamer Ergonômica Sentinel Colbat Blue PCYes", cat: "Cadeiras", img: "https://cdn.oderco.com.br/produtos/212146/138B26D1B2AFAFE5E0630300A8C068DE", sec: ["https://cdn.oderco.com.br/produtos/212146/138B26D1B2B0AFE5E0630300A8C068DE", "https://cdn.oderco.com.br/produtos/212146/138B26D1B2B1AFE5E0630300A8C068DE"] },
  { name: "Cadeira Gamer PCYES Ergonômica Sentinel Mint Green PCSTL-VD", cat: "Cadeiras", img: "https://cdn.oderco.com.br/produtos/212147/373BBAEAC7BA7463E0630300A8C033BD", sec: ["https://cdn.oderco.com.br/produtos/212147/373BBAEAC7BB7463E0630300A8C033BD", "https://cdn.oderco.com.br/produtos/212147/373BBAEAC7BC7463E0630300A8C033BD", "https://cdn.oderco.com.br/produtos/212147/373BBAEAC7BD7463E0630300A8C033BD"] },
  { name: "Gabinete Gamer PCYES Forcefield Max Black Vulcan Vidro Temperado", cat: "Gabinetes", img: "https://cdn.oderco.com.br/produtos/252557/3F00DCAA20B56D04E0630300A8C06874", sec: ["https://cdn.oderco.com.br/produtos/252557/3F00DCAA20B86D04E0630300A8C06874", "https://cdn.oderco.com.br/produtos/252557/3F00DCAA20B96D04E0630300A8C06874"] },
  { name: "Gabinete Gamer PCYES Forcefield Black Vulcan Vidro Temperado", cat: "Gabinetes", img: "https://cdn.oderco.com.br/produtos/191991/3F00DCAA20E46D04E0630300A8C06874", sec: ["https://cdn.oderco.com.br/produtos/191991/3F00DCAA20E86D04E0630300A8C06874", "https://cdn.oderco.com.br/produtos/191991/3F00DCAA20E66D04E0630300A8C06874"] },
  { name: "Gabinete Gamer PCYES Forcefield White Ghost Vidro Temperado", cat: "Gabinetes", img: "https://cdn.oderco.com.br/produtos/191992/3F00DCAA20EA6D04E0630300A8C06874", sec: ["https://cdn.oderco.com.br/produtos/191992/3F00DCAA20EE6D04E0630300A8C06874", "https://cdn.oderco.com.br/produtos/191992/3F00DCAA20EC6D04E0630300A8C06874"] },
  { name: "Gabinete Gamer Set Black Vulcan Vidro Temperado", cat: "Gabinetes", img: "https://cdn.oderco.com.br/produtos/191993/3F00DCAA20D96D04E0630300A8C06874", sec: ["https://cdn.oderco.com.br/produtos/191993/3F00DCAA20DC6D04E0630300A8C06874", "https://cdn.oderco.com.br/produtos/191993/3F1792E8B2A233F0E0630300A8C0B19C"] },
  { name: "Gabinete Gamer Set White Ghost Vidro Lateral", cat: "Gabinetes", img: "https://cdn.oderco.com.br/produtos/191994/3F00DCAA20DE6D04E0630300A8C06874", sec: ["https://cdn.oderco.com.br/produtos/191994/3F00DCAA20DF6D04E0630300A8C06874", "https://cdn.oderco.com.br/produtos/191994/3F00DCAA20E06D04E0630300A8C06874", "https://cdn.oderco.com.br/produtos/191994/3F00DCAA20E16D04E0630300A8C06874"] },
  { name: "Mouse Pad Obsidian G2D PCYES Black 500x400mm", cat: "Periféricos", img: "https://cdn.oderco.com.br/produtos/207001/0813C43B72B06C60E0630300A8C0C984", sec: ["https://cdn.oderco.com.br/produtos/207001/0829AC2B7EDA07F2E0630300A8C0ACC5"] },
  { name: "Mouse Pad PCYES Gamer Obsidian G3D 500x400 Vidro", cat: "Periféricos", img: "https://cdn.oderco.com.br/produtos/207002/FD6585990BA79601E0530300A8C09D90", sec: ["https://cdn.oderco.com.br/produtos/207002/0829AC2B7EE107F2E0630300A8C0ACC5"] },
  { name: "Mouse Pad Obsidian G4D PCYES Purple 500x400mm", cat: "Periféricos", img: "https://cdn.oderco.com.br/produtos/230651/1A89C644F4C1D041E0630300A8C0BD5D", sec: ["https://cdn.oderco.com.br/produtos/230651/1A89C644F4C4D041E0630300A8C0BD5D"] },
  { name: "Mouse Pad Obsidian G2D Extended PCYES Black 900x420mm", cat: "Periféricos", img: "https://cdn.oderco.com.br/produtos/230652/3FA519DFE3CDF8BBE0630300A8C0CD12", sec: ["https://cdn.oderco.com.br/produtos/230652/3FA519DFE3D0F8BBE0630300A8C0CD12"] },
  { name: "Mouse Pad Gamer Maze PCYES White Ghost Extended 900x420mm", cat: "Periféricos", img: "https://cdn.oderco.com.br/produtos/268133/3FA5BA5A4893B008E0630300A8C0D3E2", sec: ["https://cdn.oderco.com.br/produtos/268133/3FA5BA5A4896B008E0630300A8C0D3E2"] },
  { name: "Mouse PCYES Gamer Basaran Black Vulcan RGB 12400DPI Silent Click", cat: "Periféricos", img: "https://cdn.oderco.com.br/produtos/199399/3F2E42F714F7871CE0630300A8C048F6", sec: ["https://cdn.oderco.com.br/produtos/199399/3F2E42F714F8871CE0630300A8C048F6"] },
  { name: "Mouse Gamer Sem Fio PCYES Basaran Stealth White Ghost 10000 DPI RGB", cat: "Periféricos", img: "https://cdn.oderco.com.br/produtos/199420/FBD0003333EA8CF3E0530300A8C0E348", sec: ["https://cdn.oderco.com.br/produtos/199420/400A4BB249A32EC2E0630300A8C02A2C"] },
  { name: "Mouse PCYES Gamer Gaius RGB 12400DPI 6 Botões", cat: "Periféricos", img: "https://cdn.oderco.com.br/produtos/199396/3F2E42F714EB871CE0630300A8C048F6", sec: ["https://cdn.oderco.com.br/produtos/199396/3F2E42F714EC871CE0630300A8C048F6"] },
  { name: "Mouse PCYES Gamer Valus RGB 12400DPI 8 Botões", cat: "Periféricos", img: "https://cdn.oderco.com.br/produtos/199397/3F2E42F714F1871CE0630300A8C048F6", sec: ["https://cdn.oderco.com.br/produtos/199397/3F2E42F714F2871CE0630300A8C048F6"] },
  { name: "Mouse Gamer Argus PCYES RGB 12400DPI 8 Botões", cat: "Periféricos", img: "https://cdn.oderco.com.br/produtos/253933/3F69B8315645C752E0630300A8C059F1", sec: ["https://cdn.oderco.com.br/produtos/253933/3F69B8315646C752E0630300A8C059F1"] },
  { name: "Teclado Mecânico PCYES Kuromori White Ghost Blue Switch", cat: "Periféricos", img: "https://cdn.oderco.com.br/produtos/246231/3FA2133D8BCE330EE0630300A8C0F6B9", sec: [] },
  { name: "Teclado Mecânico PCYES Kuromori Black Vulcan Blue Switch", cat: "Periféricos", img: "https://cdn.oderco.com.br/produtos/199408/3FA0B95161429B0EE0630300A8C04A18", sec: [] },
  { name: "Teclado Mecânico PCYES Kuromori Black Vulcan Red Switch", cat: "Periféricos", img: "https://cdn.oderco.com.br/produtos/199409/3FA2133D8BC8330EE0630300A8C0F6B9", sec: [] },
  { name: "Teclado Mecânico PCYES Kuromori White Ghost Red Switch", cat: "Periféricos", img: "https://cdn.oderco.com.br/produtos/246230/3FA0FF24E03F4B06E0630300A8C0A92F", sec: [] },
  { name: "Teclado Mecânico PCYES Kuromori Voyager Edition Blue Switch", cat: "Periféricos", img: "https://cdn.oderco.com.br/produtos/286135/25C7064E389DE6C2E0630300A8C0EDA5", sec: [] },
  { name: "Suporte Para Microfone PCYES Streaming Podcast Braço Articulado", cat: "Streaming", img: "https://cdn.oderco.com.br/produtos/111551/4004C0883B7321AAE0630300A8C0B09E", sec: [] },
  { name: "Suporte de Parede para Monitor PCYES 17\"-32\" Pistão a Gás", cat: "Monitores", img: "https://cdn.oderco.com.br/produtos/192831/401821A4EDB6BD3AE0630300A8C04C48", sec: [] },
  { name: "Suporte Articulado Para Monitor PCYES 17-32 Pistão a Gás USB Áudio", cat: "Monitores", img: "https://cdn.oderco.com.br/produtos/194261/401821A4EDACBD3AE0630300A8C04C48", sec: [] },
  { name: "Suporte Articulado para Monitor PCYES Branco 17\"-32\" com USB 3.0", cat: "Monitores", img: "https://cdn.oderco.com.br/produtos/194262/401821A4EDB1BD3AE0630300A8C04C48", sec: [] },
  { name: "Suporte Para Setup Studio PCYES 4 em 1 Monitor 17-32", cat: "Monitores", img: "https://cdn.oderco.com.br/produtos/195241/401821A4EDA7BD3AE0630300A8C04C48", sec: [] },
  
  // Placas de Vídeo
  { name: "GT 710 2GB DDR3 Low Profile", cat: "Placas de Vídeo", img: "https://cdn.oderco.com.br/produtos/282767/2D04A9618C5EF13EE0630300A8C0554C", sec: ["https://cdn.oderco.com.br/produtos/282767/2D04A9618C5FF13EE0630300A8C0554C", "https://cdn.oderco.com.br/produtos/282767/2D04A9618C60F13EE0630300A8C0554C", "https://cdn.oderco.com.br/produtos/282767/2D04A9618C62F13EE0630300A8C0554C"] },
  { name: "GT 740 2GB GDDR5 128 Bits", cat: "Placas de Vídeo", img: "https://cdn.oderco.com.br/produtos/259330/189437062258193CE0630300A8C08D4D", sec: [] },
  { name: "GT740 4GB GDDR5 128 Bits", cat: "Placas de Vídeo", img: "https://cdn.oderco.com.br/produtos/261071/1982E845579812A0E0630300A8C04222", sec: [] },
  { name: "GT730 2GB DDR5 64 Bits Edge Low Profile", cat: "Placas de Vídeo", img: "https://cdn.oderco.com.br/produtos/261089/1982E845579A12A0E0630300A8C04222", sec: ["https://cdn.oderco.com.br/produtos/261089/25C94E9521803DCCE0630300A8C00F3E"] },
  { name: "GT730 4GB GDDR5 Low Profile Single Fan", cat: "Placas de Vídeo", img: "https://cdn.oderco.com.br/produtos/261073/1982E845579912A0E0630300A8C04222", sec: ["https://cdn.oderco.com.br/produtos/261073/25C94E9521893DCCE0630300A8C00F3E"] },

  // SSD e HD
  { name: "SSD PCYES 256GB M.2 NVMe PCIe 3.0x4", cat: "SSD e HD", img: "https://cdn.oderco.com.br/produtos/202394/401A241D79BE4FABE0630300A8C0903C", sec: [] },
  { name: "SSD PCYES 512GB M.2 NVMe 2200MB/s", cat: "SSD e HD", img: "https://cdn.oderco.com.br/produtos/202395/4520E92D66A8C021E0630300A8C02B6F", sec: [] },
  { name: "SSD PCYES 512GB SATA III 2,5\"", cat: "SSD e HD", img: "https://cdn.oderco.com.br/produtos/192060/401A241D79A54FABE0630300A8C0903C", sec: [] },
  { name: "SSD PCYES 1TB SATA III 2.5", cat: "SSD e HD", img: "https://cdn.oderco.com.br/produtos/202396/401A241D79B44FABE0630300A8C0903C", sec: [] },
  { name: "SSD PCYES 128GB SATA III", cat: "SSD e HD", img: "https://cdn.oderco.com.br/produtos/157400/401A241D79AF4FABE0630300A8C0903C", sec: [] },

  // Refrigeração
  { name: "Cooler para Processador PCYES Nótus ST Intel TDP 65W", cat: "Refrigeração", img: "https://cdn.oderco.com.br/produtos/32846/3F9F1AE4EDB8A0D1E0630300A8C05422", sec: [] },
  { name: "Water Cooler PCYES Sangue Frio 3 White Ghost 120mm", cat: "Refrigeração", img: "https://cdn.oderco.com.br/produtos/210397/3D7FF909C0F830B1E0630300A8C042C0", sec: [] },
  { name: "Water Cooler PCYES Sangue Frio 3 ARGB White Ghost 120mm", cat: "Refrigeração", img: "https://cdn.oderco.com.br/produtos/210410/3D7292BA47F8A9BFE0630300A8C09253", sec: [] },
  { name: "Pasta Térmica Nitrogen Pro 1,5g", cat: "Refrigeração", img: "https://cdn.oderco.com.br/produtos/155239/3F8ADEAEEF3B3746E0630300A8C00BDC", sec: [] },
  { name: "Pasta Térmica Nitrogen Pro 4g", cat: "Refrigeração", img: "https://cdn.oderco.com.br/produtos/156177/3F8ADEAEEF443746E0630300A8C00BDC", sec: [] }
];

let out = `export interface Product {
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

export const allProducts: Product[] = [\n`;

products.forEach((p, i) => {
  let priceNum = 0;
  if (p.cat === 'Cadeiras') priceNum = 1299.90;
  else if (p.cat === 'Gabinetes') priceNum = 599.90;
  else if (p.cat === 'Periféricos' && p.name.includes('Teclado')) priceNum = 399.90;
  else if (p.cat === 'Periféricos' && p.name.includes('Mouse Pad')) priceNum = 149.90;
  else if (p.cat === 'Periféricos') priceNum = 249.90;
  else if (p.cat === 'Streaming') priceNum = 199.90;
  else if (p.cat === 'Monitores') priceNum = 299.90;
  else if (p.cat === 'Placas de Vídeo') priceNum = 499.90;
  else if (p.cat === 'SSD e HD') priceNum = 299.90;
  else if (p.cat === 'Refrigeração' && p.name.includes('Cooler')) priceNum = 349.90;
  else if (p.cat === 'Refrigeração' && p.name.includes('Pasta')) priceNum = 49.90;
  else priceNum = 199.90;
  
  let priceStr = "R$ " + priceNum.toFixed(2).replace('.', ',');
  
  let oldPriceNum = undefined;
  let oldPriceStr = undefined;
  if (i % 3 === 0) { // Every 3rd product has a discount
    oldPriceNum = priceNum * 1.25;
    oldPriceStr = "R$ " + oldPriceNum.toFixed(2).replace('.', ',');
  }

  let badge = undefined;
  if (p.name.includes('Blue Switch')) badge = 'BLUE SWITCH';
  if (p.name.includes('Red Switch')) badge = 'RED SWITCH';
  if (p.name.includes('Brown Switch')) badge = 'BROWN SWITCH';

  out += `  {
    id: ${i + 1},
    name: "${p.name.replace(/\"/g, '\\"')}",
    price: "${priceStr}",
    priceNum: ${priceNum},
    ${oldPriceNum ? `oldPrice: "${oldPriceStr}",\n    oldPriceNum: ${oldPriceNum},` : ''}
    ${badge ? `badge: "${badge}",` : ''}
    rating: 4.${Math.floor(Math.random() * 5) + 5},
    reviews: ${Math.floor(Math.random() * 400) + 50},
    category: "${p.cat}",
    tags: ["Gaming", "${p.cat}"],
    brand: "PCYES",
    image: "${p.img}",
    images: [${[p.img, ...p.sec].map(u => `"${u}"`).join(', ')}],
    description: "${p.name.replace(/\"/g, '\\"')} da PCYES, alta qualidade para o seu setup gamer.",
    features: ["Alta durabilidade", "Design moderno", "Qualidade PCYES"],
    specs: [{ label: "Marca", value: "PCYES" }]
  },\n`;
});

out += `];

export const categories = ["Gabinetes", "Periféricos", "Monitores", "Cadeiras", "Streaming", "Placas de Vídeo", "SSD e HD", "Refrigeração"];
export const allTags = ["Gaming", "RGB", "Wireless", "Streaming", "Escritório", "Placas de Vídeo", "SSD e HD", "Refrigeração"];
export const brands = ["PCYES"];
`;

fs.writeFileSync('src/app/components/productsData.ts', out);
