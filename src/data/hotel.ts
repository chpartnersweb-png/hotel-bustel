import beds from '../assets/IMG_3284.JPG';
import tatami from '../assets/IMG_3281.JPG';
import washbasin from '../assets/IMG_3280.JPG';
import bathroom from '../assets/IMG_3283.JPG';
import entrance from '../assets/IMG_3282.JPG';

export const hotel = {
  name: 'HOTEL BUSTEL',
  phone: '045-315-7155',
  phoneHref: 'tel:0453157155',
  address: '神奈川県横浜市中区伊勢佐木町6−140−7',
  addressLines: ['神奈川県横浜市中区', '伊勢佐木町6−140−7'],
  station: '京急黄金町駅',
  walkMinutes: 5,
  rooms: 20,
  frontHours: '10:00〜22:00頃',
  closed: 'なし',
  checkIn: '14:30〜（最終22:00）',
  checkOut: '12:00まで',
  prices: [
    { label: '平日', english: 'WEEKDAYS', amount: 9000 },
    { label: '土日休日', english: 'WEEKENDS & HOLIDAYS', amount: 15000 },
  ],
  bookings: [
    { name: '楽天トラベル', english: 'RAKUTEN TRAVEL', url: 'https://hotel.travel.rakuten.co.jp/hinfo/202394/' },
    { name: 'Trip.com', english: 'TRIP.COM', url: 'https://jp.trip.com/hotels/cityname-hotel-detail-133194720/hotelname/' },
  ],
} as const;

const mapQuery = encodeURIComponent(`${hotel.name} ${hotel.address}`);
export const mapUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;
export const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${mapQuery}&travelmode=walking`;
export const mapEmbedUrl = `https://maps.google.com/maps?q=${mapQuery}&output=embed&hl=ja&z=16`;

export const photos = [
  { image: beds, title: 'ベッドを備えた客室', alt: '白い寝具とブラウンのベッドランナー、紺のカーテンを配した客室', note: '客室の一例', source: '提供素材 IMG_3284.JPG' },
  { image: tatami, title: '畳スペースを備えた客室', alt: '木目の床と畳スペースに布団を並べた客室', note: '客室の一例', source: '提供素材 IMG_3281.JPG' },
  { image: washbasin, title: '洗面スペース', alt: '丸い鏡と白い洗面台を備えた洗面スペース', note: '設備の一例', source: '提供素材 IMG_3280.JPG' },
  { image: bathroom, title: 'バスルーム', alt: '浴槽と洗い場を備えたバスルーム', note: '設備の一例', source: '提供素材 IMG_3283.JPG' },
  { image: entrance, title: 'エントランス', alt: '明るいタイルと赤いマットがあるHOTEL BUSTELの入口', note: '館内の一例', source: '提供素材 IMG_3282.JPG' },
];

export const navigation = [
  { href: '#price', english: 'Price', japanese: '料金案内' },
  { href: '#rooms', english: 'Rooms', japanese: '客室' },
  { href: '#information', english: 'Information', japanese: 'ご滞在案内' },
  { href: '#access', english: 'Access', japanese: 'アクセス' },
  { href: '#reservation', english: 'Reservation', japanese: 'ご予約・お問い合わせ' },
];
