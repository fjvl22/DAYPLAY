export interface GuessResult {
    letter: string;
    status: 'correct' | 'present' | 'absent';
}
