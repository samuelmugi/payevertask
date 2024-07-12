import { Test, TestingModule } from "@nestjs/testing";
import axios from "axios";
import * as fs from "fs";
import { UserService } from "./user.service";
import { UserRepository } from "./repository/user.repository";
import { AvatarRepository } from "./repository/avatar.repository";
import { MessagingService } from "../rabbitmq/messaging.service";
import { CreateUserDto } from "./dto/user.dto";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockUser = {
  name: "John Doe",
  job: "Developer"
};

const mockCreateUserDto: CreateUserDto = {
  name: "John Doe",
  job: "Developer"
};

describe("UserService", () => {
  let service: UserService;
  let userRepository: UserRepository;
  let avatarRepository: AvatarRepository;
  let messagingService: MessagingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: {
            create: jest.fn(),
            findById: jest.fn(),
            updateById: jest.fn()
          }
        },
        {
          provide: AvatarRepository,
          useValue: {
            findByUserId: jest.fn(),
            findByUserIdAndUpdate: jest.fn(),
            create: jest.fn()
          }
        },
        {
          provide: MessagingService,
          useValue: {
            sendMessage: jest.fn(),
            onModuleInit: jest.fn()
          }
        }
      ]
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);
    avatarRepository = module.get<AvatarRepository>(AvatarRepository);
    messagingService = module.get<MessagingService>(MessagingService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a user", async () => {
    userRepository.create = jest.fn().mockResolvedValue(mockUser);

    const result = await service.createUser(mockCreateUserDto);

    expect(userRepository.create).toHaveBeenCalledWith(mockCreateUserDto);
    expect(messagingService.sendMessage).toHaveBeenCalledWith("user_created", mockUser);
    expect(result).toEqual(mockUser);
  });

  it("should get user details from external API", async () => {
    const mockUserId = "1";
    const mockResponseData = { /* fill with mock data */ };
    mockedAxios.get.mockResolvedValue({ data: { data: mockResponseData } });

    const result = await service.getUser(mockUserId);

    expect(mockedAxios.get).toHaveBeenCalledWith(`https://reqres.in/api/users/${mockUserId}`);
    expect(result).toEqual(mockResponseData);
  });

  it("should get avatar from repository or fetch from API and persist", async () => {
    const mockUserId = "1";
    const mockAvatarFromRepository = { avatarHash: "mockHash" };
    avatarRepository.findByUserId = jest.fn().mockResolvedValue(mockAvatarFromRepository);

    const mockResponseData = { data: { avatar: "https://reqres.in/img/faces/1-image.jpg" } };
    mockedAxios.get.mockResolvedValue(mockResponseData);
    mockedAxios.get.mockResolvedValueOnce({ data: new ArrayBuffer(0) });
    // Mock fs.readFileSync
    const readFileSyncMock = jest.spyOn(fs, "readFileSync");
    readFileSyncMock.mockReturnValue("mockBase64String");

    // Mock fs.writeFileSync
    const writeFileSyncMock = jest.spyOn(fs, "writeFileSync");
    writeFileSyncMock.mockImplementation();

    const result = await service.getUserAvatar(mockUserId);

    expect(avatarRepository.findByUserId).toHaveBeenCalledWith(mockUserId);
    expect(fs.readFileSync).toHaveBeenCalled();

  });

  it("should delete user avatar", async () => {
    const mockUserId = "1";
    const mockAvatarFromRepository = { avatarHash: "mockHash" };
    avatarRepository.findByUserId = jest.fn().mockResolvedValue(mockAvatarFromRepository);

    await service.deleteUserAvatar(mockUserId);

    expect(avatarRepository.findByUserId).toHaveBeenCalledWith(mockUserId);
    expect(avatarRepository.findByUserIdAndUpdate).toHaveBeenCalled();
  });
});
