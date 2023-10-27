export interface ISportsBook {

    bookId: string;
    sportKey: string;
    sportTitle: string;
    homeTeam: string;
    awayTeam: string;
    commenceTime: Date;
    bookmaker: string;
    marketKey: string;
    name: string;
    price: number;
    point: number
}
