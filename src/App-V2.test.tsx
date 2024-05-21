import React from "react";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import Stopwatch from "./App-V2";

describe("Stopwatch", () => {
  afterEach(() => {
    cleanup();
  });
  it("Should render without errors", () => {
    render(<Stopwatch initialSeconds={0} />);
    expect(screen.getByText("00:00:00")).toBeInTheDocument();
  });
  it("Should format and show initialSeconds", ()=> {
    const { rerender } = render(<Stopwatch initialSeconds={1003} />);
    expect(screen.getByText("00:16:43")).toBeInTheDocument();
    rerender(<Stopwatch initialSeconds={1065} />);
    expect(screen.getByText("00:17:45")).toBeInTheDocument();
  });
  it("Should show start initially, and no reset if initialSeconds=0", ()=> {
    render(<Stopwatch initialSeconds={0} />);
    expect(screen.getByRole("button", {name: "start"})).toBeInTheDocument();
    expect(screen.queryByRole("button", {name: "reset"})).toBeNull();
  });
  it("Should show start and reset if initialSeconds>0", ()=> {
    render(<Stopwatch initialSeconds={10} />);
    expect(screen.getByRole("button", {name: "start"})).toBeInTheDocument();
    expect(screen.getByRole("button", {name: "reset"})).toBeInTheDocument();
  });
  it("Click on Start should start the timer, show stop and lap buttons", async ()=> {
    jest.useFakeTimers();
    render(<Stopwatch initialSeconds={10} />);
    const startBtn = screen.getByRole("button", {name: "start"});
    expect(screen.getByRole("button", {name: "reset"})).toBeInTheDocument();
    fireEvent.click(startBtn);
    act(() => {
      jest.advanceTimersByTime(15000);
    })
    expect(await screen.findByText("00:00:25")).toBeInTheDocument();
    expect(await screen.findByRole("button", {name: "stop"})).toBeInTheDocument();
    expect(await screen.findByRole("button", {name: "lap"})).toBeInTheDocument();
    // start and reset buttons should not be in the document 
    expect(screen.queryByRole("button", {name: "start"})).toBeNull();
    expect(screen.queryByRole("button", {name: "reset"})).toBeNull();
  });
  it("Click on lap should add and show laps", async ()=> {
    jest.useFakeTimers();
    render(<Stopwatch initialSeconds={10} />);
    const startBtn = screen.getByRole("button", {name: "start"});
    fireEvent.click(startBtn);
    act(() => {
      jest.advanceTimersByTime(10000);
    })
    const lapBtn = await screen.findByRole("button", {name: "lap"})
    fireEvent.click(lapBtn);
    act(() => {
      jest.advanceTimersByTime(2000);
    })
    expect((await screen.findAllByText((_, element) =>  element?.textContent?.startsWith("1/ 00:00:20") || false )).length).toBeGreaterThan(0);
    expect(await screen.findByRole("button", {name: "X"})).toBeInTheDocument()
  });
  it("Click on X should remove lap", async ()=> {
    jest.useFakeTimers();
    render(<Stopwatch initialSeconds={10} />);
    const startBtn = screen.getByRole("button", {name: "start"});
    fireEvent.click(startBtn);
    act(() => {
      jest.advanceTimersByTime(11000);
    })
    const lapBtn = await screen.findByRole("button", {name: "lap"})
    act(() => {
      jest.advanceTimersByTime(3000);
    })
    fireEvent.click(lapBtn);
    const xBtn = await screen.findByRole("button", {name: "X"});
    fireEvent.click(xBtn);
    act(() => {
      jest.advanceTimersByTime(3000);
    })
    expect(screen.queryByText("00:00:21")).toBeNull();
  });
  it("Click on stop should stop timer", async ()=> {
    jest.useFakeTimers();
    render(<Stopwatch initialSeconds={10} />);
    const startBtn = screen.getByRole("button", {name: "start"});
    fireEvent.click(startBtn);
    act(() => {
      jest.advanceTimersByTime(8000);
    })
    const stopBtn = await screen.findByRole("button", {name: "stop"})
    fireEvent.click(stopBtn);
    act(() => {
      jest.advanceTimersByTime(2000);
    })
    expect(screen.getByText("00:00:18")).toBeInTheDocument();
    expect(screen.queryByText("00:00:20")).toBeNull();
  });
  it("Click on reset should set time to 0, clear laps", async ()=> {
    jest.useFakeTimers();
    render(<Stopwatch initialSeconds={10} />);
    const startBtn = screen.getByRole("button", {name: "start"});
    fireEvent.click(startBtn);
    act(() => {
      jest.advanceTimersByTime(8000);
    })
    const lapBtn = await screen.findByRole("button", {name: "lap"})
    fireEvent.click(lapBtn);
    act(() => {
      jest.advanceTimersByTime(2000);
    })
    expect(screen.getByText("00:00:20")).toBeInTheDocument();
    expect(screen.getByText("00:00:18", {exact: false})).toBeInTheDocument();

    const stopBtn = await screen.findByRole("button", {name: "stop"})
    fireEvent.click(stopBtn);
    const resetBtn = await screen.findByRole("button", {name: "reset"})
    fireEvent.click(resetBtn);
    expect(screen.getByText("00:00:00")).toBeInTheDocument();
    expect(screen.queryByText("00:00:18", {exact: false})).toBeNull();
  });
  it("start -> stop -> start timer should continue", async ()=> {
    jest.useFakeTimers();
    render(<Stopwatch initialSeconds={10} />);
    const startBtn = screen.getByRole("button", {name: "start"});
    fireEvent.click(startBtn);
    act(() => {
      jest.advanceTimersByTime(8000);
    })
    const stopBtn = await screen.findByRole("button", {name: "stop"})
    fireEvent.click(stopBtn);

    const restartBtn = await screen.findByRole("button", {name: "start"})
    fireEvent.click(restartBtn);

    act(() => {
      jest.advanceTimersByTime(8000);
    })

    expect(screen.getByText("00:00:26")).toBeInTheDocument();
  });
});
