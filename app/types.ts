export type Character = {
   id: string;
   displayNum: string;
   displayName: {
    en_US: string;
   }
   displayNameEn: string;
   file: string;
   comboMoveType: "dash-first" | "no-dash" | ""
   percentWindow: [number, number] | false | [number, false]
}
