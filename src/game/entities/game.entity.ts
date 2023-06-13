
enum GameStatus
{
    Waiting,
    Started,

}
export interface Vector2
{
    X : number;
    Y: number;
}

export class Game {
    player1 : string;
    player2 : string;
    player1_id : number;
    player2_id : number;
    player1_pos? : Vector2;
    player2_pos? : Vector2;
    ball_pos? : Vector2;
    ball_speed? : number;
    gameStatus? : GameStatus;
}
