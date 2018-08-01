import Message from "../models/Message";

export class InterestEvents {

  static async created(interest: any) {
    // Send message
    const message = {
        text: 'hey we are interested in you. please ...',
        to: '',
        from: '',
        job: ''
    };
    await Message.create(message);
    // Send email
  }
}