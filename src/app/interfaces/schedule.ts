import { Airline } from "./airline";
import { FlightClass } from "./flight-class";
import { Status } from "./status";

export interface Schedule {
    flightCode: string;
    airline: Airline;
    source: string;
    destination: string;
    flightClass: FlightClass[];
    eta: string;
    sta: string;
    flightHours: number;
    status: Status
}

export interface SearchSchedule {
    date: string;
	source: string;
	destination: string;
	trip: string|null;
}