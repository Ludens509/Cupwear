// export interface Jersey {
//   id: string;
//   country: string;
//   price: number;
//   size: string;
//   tag?: string;
// }

// export  interface NavLink{
//     label:string;
//     href:string;
// }

export interface Jersey {
  id: string;
  country: string;
  flag: string;
  homeColor: string;
  awayColor: string;
  accentColor: string;
  numberColor: string;
  number: string;
  playerName: string;
  price: number;
  group: string;
  tag?: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface Testimonials {
  id: number;
  segments:{text:string; muted:boolean}[];
  name:string;
  role:string;
  avatar:string;
}