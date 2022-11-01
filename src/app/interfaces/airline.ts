import { MealType } from "./meal-type";
import { Status } from "./status";

export interface Airline {
    airlineId: number;
    airlineName: string;
    noOfSeats: number;
    mealAvailable: boolean;
    mealType: MealType[];
    airlineStatus: Status;
    status: number;
}
