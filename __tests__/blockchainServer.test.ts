import request from "supertest"
import { app } from "../src/server/blockchainServer"
import Block from "../src/lib/block"
import block from "../src/lib/block"

jest.mock("../src/lib/block")
jest.mock("../src/lib/blockchain")

describe("BlockchainServer Test", () => {
  test("GET /status - Should return status", async () => {
    const response = await request(app).get("/status")

    expect(response.status).toEqual(200)
    expect(response.body.isValid.success).toEqual(true)
  })

  test("GET /blocks/:index - Should get genesis block", async () => {
    const response = await request(app).get("/blocks/0")
    expect(response.status).toEqual(200)
    expect(response.body.index).toEqual(0)
  })

  test("GET /blocks/next - Should get next block info", async () => {
    const response = await request(app).get("/blocks/next")
    expect(response.status).toEqual(200)
    expect(response.body.index).toEqual(1)
  })

  test("GET /blocks/:hash - Should get genesis block", async () => {
    const response = await request(app).get("/blocks/genesis")
    expect(response.status).toEqual(200)
    expect(response.body.hash).toEqual("genesis")
  })

  test("GET /blocks/:index - Should not get block", async () => {
    const response = await request(app).get("/blocks/-1")
    expect(response.status).toEqual(404)
  })

  test("GET /blocks/:hash - Should not get block", async () => {
    const response = await request(app).get("/blocks/wrong")
    expect(response.status).toEqual(404)
  })

  test("POST /blocks - Should add block", async () => {
    const block = new Block({
      index: 1,
    } as Block)
    const response = await request(app).post("/blocks").send(block)
    expect(response.status).toEqual(201)
    expect(response.body.index).toEqual(1)
  })

  test("POST /blocks - Should NOT add block (empty)", async () => {
    const response = await request(app).post("/blocks").send({})
    expect(response.status).toEqual(422)
  })

  test("POST /blocks - Should NOT add block (invalid)", async () => {
    const block = new Block({
      index: -1,
    } as Block)
    const response = await request(app).post("/blocks").send(block)
    expect(response.status).toEqual(400)
  })
})
