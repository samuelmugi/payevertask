import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/user.dto';

const mockUser = {
  name: 'John Doe',
  job: 'Developer',
 };

const mockCreateUserDto: CreateUserDto = {
  name: 'John Doe',
  job: 'Developer',
};

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            createUser: jest.fn().mockResolvedValue(mockUser),
            getUser: jest.fn().mockResolvedValue(mockUser),
            getUserAvatar: jest.fn().mockResolvedValue('avatarBase64'),
            deleteUserAvatar: jest.fn().mockResolvedValue(null),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', async () => {
    const result = await controller.createUser(mockCreateUserDto);
    expect(result).toEqual(mockUser);
  });

  it('should get a user by id', async () => {
    const result = await controller.getUser('someId');
    expect(result).toEqual(mockUser);
  });

  it('should get a user avatar', async () => {
    const result = await controller.getUserAvatar('someId');
    expect(result).toEqual('avatarBase64');
  });

  it('should delete a user avatar', async () => {
    const result = await controller.deleteUserAvatar('someId');
    expect(result).toBeNull();
  });
});
