const { User, Connection } = require('../index');
const {
  testDB,
  mockData: { ConnectionMock, UserMock },
} = require('../../test_utils');

describe('Relationship Test',
() => {
  let owner;
  let partner;
  let connection;
  beforeAll(async () => {
    try {
      await testDB.connect(true);
      const { userOne, userTwo } = UserMock;
      const {
        ownerID,
        partnerID,
        ...data
      } = ConnectionMock.connectionOne(false, false);

      owner = await User.create(userOne);
      partner = await User.create(userTwo);
      connection = await Connection.create({
        ownerID: owner.id,
        partnerID: partner.id,
        ...data,
      });
    } catch (e) { console.log(e); }
  });

  describe('user.ownedConnections()',
  () => {
    let ownedConnections;
    beforeAll(async () => {
      ownedConnections = await owner.ownedConnections();
    });
    it('gets the Connections created by the user', () => {
      expect(ownedConnections).toBeInstanceOf(Array);
      expect(ownedConnections.length).toBe(1);
      expect(ownedConnections.map(doc => doc.id)).toContain(connection.id);
    });
  });

  describe('user.joinedConnections()',
  () => {
    let joinedConnections;
    beforeAll(async () => {
      joinedConnections = await partner.joinedConnections();
    });

    it('should return an array',
    () => expect(joinedConnections).toBeInstanceOf(Array));

    it('should only return connections joined by user',
    () => expect(joinedConnections.length).toBe(1));

    it('should return connection joined by user',
    () => expect(joinedConnections.map(doc => doc.id)).toContain(connection.id));
  });

  describe('connection.getOwner()',
  () => {
    let connectionOwner;
    beforeAll(async () => {
      connectionOwner = await connection.getOwner();
    });

    it('should return a User instance',
    () => expect(connectionOwner).toBeInstanceOf(User));

    it('should return the owner User',
    () => expect(connectionOwner.id).toBe(owner.id));
  });

  describe('connection.getPartner()',
  () => {
    let connectionPartner;
    beforeAll(async () => {
      connectionPartner = await connection.getPartner();
    });

    it('should return a User instance',
    () => expect(connectionPartner).toBeInstanceOf(User));

    it('should return the partner User',
    () => expect(connectionPartner.id).toBe(partner.id));
  });

  afterAll(
  async () => {
    try {
      await User.deleteMany({});
      await Connection.deleteMany({});
      testDB.disconnect(true);
    } catch (e) { console.log(e); }
  });
});
