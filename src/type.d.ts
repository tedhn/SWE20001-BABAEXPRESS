export interface UserType {
  userId: string;
  name: string;
  email: string;
  type: string;
  password: string;
}

export interface RegisterSuccessType {
  success: boolean;
  user: UserType;
}

export interface RouteType {
  route_Id: string;
  from: string;
  to: string;
  departure_Time: string;
  estimated_Duration: string;
  price: string;
  bookedSeats: string;
}

export interface TicketType {
  ticket_id: string;
  seat_numbers: string;
  user_id: string;
  route_id: string;
}
