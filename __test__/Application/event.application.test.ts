import { Event } from "../../src/Application/event.application";
import { InternalError } from "../../src/Domain/Errors/InternalError";
import { NotCreatedError } from "../../src/Domain/Errors/NotCreatedError";
import { NotFoundError } from "../../src/Domain/Errors/NotFoundError";
import { NotUpdatedError } from "../../src/Domain/Errors/NotUpdatedError";
import {
  IEvent,
  IEventCreate,
} from "../../src/Domain/interfaces/Event.interfaces";
import { IEventServices } from "../../src/Domain/Services/IEvent.services";
import { IGenerateIdService } from "../../src/infrastructure/interface/IGenerateId.interface";

describe("Test use case register event", () => {
  // ARRANGE
  class EventServiceMock implements IEventServices {
    async create(event: IEventCreate): Promise<IEvent> {
      return {
        id: "1",
        title: "Sample Event",
        description: "Event description",
        date: new Date(),
        location: "Event location",
        organizer: "Organizer",
      };
    }

    async getById(id: IEvent["id"]): Promise<IEvent> {
      return {
        id: "1",
        title: "Sample Event",
        description: "Event description",
        date: new Date(),
        location: "Event location",
        organizer: "Organizer",
      };
    }

    async update(id: string, event: Partial<IEvent>): Promise<IEvent> {
      return {
        id: id,
        ...event,
        date: new Date(),
      } as IEvent;
    }

    async delete(id: string): Promise<IEvent> {
      return {
        id,
        title: "Sample Event",
        description: "Event description",
        date: new Date(),
        location: "Event location",
        organizer: "Organizer",
      };
    }

    async getAll(): Promise<IEvent[]> {
      return [
        {
          id: "1",
          title: "Event 1",
          description: "Description 1",
          date: new Date(),
          location: "Location 1",
          organizer: "Organizer 1",
        },
        {
          id: "2",
          title: "Event 2",
          description: "Description 2",
          date: new Date(),
          location: "Location 2",
          organizer: "Organizer 2",
        },
      ];
    }
  }

  class EventServiceErrorMock implements IEventServices {
    async create(event: IEventCreate): Promise<IEvent> {
      throw new NotCreatedError(); // Simulamos el error de creación
    }

    async getById(id: IEvent["id"]): Promise<IEvent> {
      throw new NotFoundError();
    }

    async getAll(): Promise<IEvent[]> {
      throw new NotFoundError();
    }

    async update(id: IEvent["id"], event: Partial<IEvent>): Promise<IEvent> {
      throw new NotUpdatedError();
    }

    async delete(id: IEvent["id"]): Promise<IEvent> {
      throw new InternalError();
    }
  }

  let useCase: Event;
  let useCaseEventError: Event;
  let generateIdSrvMock: IGenerateIdService;
  let eventSrvMock: IEventServices;
  let eventSrvErrorMock: IEventServices;

  beforeEach(() => {
    eventSrvMock = new EventServiceMock();
    eventSrvErrorMock = new EventServiceErrorMock();
    useCase = new Event(eventSrvMock);
    useCaseEventError = new Event(eventSrvErrorMock);
  });


  it("Should register an event successfully", async () => {
    // ARRANGE
    const event: IEventCreate = {
      title: "Sample Event",
      description: "Event description",
      date: new Date(),
      location: "Event location",
      organizer: "Organizer",
    };

    // ACT
    const response = await useCase.CreateNewEvent(event);

    // ASSERT
    expect(response).toStrictEqual({
      id: "1",
      title: "Sample Event",
      description: "Event description",
      date: expect.any(Date),
      location: "Event location",
      organizer: "Organizer",
    });
  });


  it("Should throw NotCreatedError when event creation fails", async () => {
    const event: IEventCreate = {
      title: "Sample Event",
      description: "Event description",
      date: new Date(),
      location: "Event location",
      organizer: "Organizer",
    };

    try {
      await useCaseEventError.CreateNewEvent(event);
    } catch (error) {
      expect(error).toBeInstanceOf(NotCreatedError);
    }
  });

  // Test para obtener todos los eventos
  it("Should get all events successfully", async () => {
    const response = await useCase.getAllEvent();

    expect(response).toStrictEqual([
      {
        id: "1",
        title: "Event 1",
        description: "Description 1",
        date: expect.any(Date),
        location: "Location 1",
        organizer: "Organizer 1",
      },
      {
        id: "2",
        title: "Event 2",
        description: "Description 2",
        date: expect.any(Date),
        location: "Location 2",
        organizer: "Organizer 2",
      },
    ]);
  });


  it("Should throw NotFoundError when no events are found", async () => {
    try {
      await useCaseEventError.getAllEvent();
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundError);
    }
  });


  it("Should get event by ID successfully", async () => {
    const response = await useCase.getByIdEvent("1");

    expect(response).toStrictEqual({
      id: "1",
      title: "Sample Event",
      description: "Event description",
      date: expect.any(Date),
      location: "Event location",
      organizer: "Organizer",
    });
  });


  it("Should throw NotFoundError when event is not found", async () => {
    try {
      await useCaseEventError.getByIdEvent("1");
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundError);
    }
  });


  it("Should update an event successfully", async () => {
    const updatedEvent = { title: "Updated Event" };
    const response = await useCase.updateEvent("1", updatedEvent);

    console.log(response);

    expect(response).toStrictEqual({
      id: "1",
      title: "Updated Event",
      description: "Event description",
      date: expect.any(Date),
      location: "Event location",
      organizer: "Organizer",
    });
  });

  
  it("Should throw NotUpdatedError when event update fails", async () => {
    const updatedEvent = { title: "Updated Event" };
    try {
      await useCaseEventError.updateEvent("1", updatedEvent);
    } catch (error) {
      expect(error).toBeInstanceOf(NotUpdatedError);
    }
  });


  it("Should delete an event successfully", async () => {
    const response = await useCase.DeleteEvent("1");

    expect(response).toStrictEqual({
      id: "1",
      title: "Sample Event",
      description: "Event description",
      date: expect.any(Date),
      location: "Event location",
      organizer: "Organizer",
    });
  });


  it("Should throw InternalError when event deletion fails", async () => {
    try {
      await useCaseEventError.DeleteEvent("1");
    } catch (error) {
      expect(error).toBeInstanceOf(InternalError);
    }
  });
});
