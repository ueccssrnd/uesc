import java.util.Random;
import java.util.Scanner;

public class GuessingGame {

    public static void main(String[] args) {
        
        Random rand = new Random();
        int toGuess = rand.nextInt(100);
        int tries = 0;
        Scanner input = new Scanner (System.in);
        int guessNumber;
        boolean win = false;
        
        while (win == false) {
            System.out.println("Guess a number between 1 and 100: ");
            guessNumber = input.nextInt();
            tries++;
            
            if (guessNumber == toGuess) {
                win = true;
            }
            else if (guessNumber < toGuess) {
                System.out.println("Your guess is too low.");
            }
            else if (guessNumber > toGuess) {
                System.out.println("Your guess is too high.");
            }
        }
        
        System.out.println("You win!");
        System.out.println("The number was " + toGuess);
        System.out.println("It took you" + tries + " tries");
    }
}
