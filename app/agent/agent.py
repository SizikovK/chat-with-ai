from langchain.messages import ToolMessage
from typing import Any, Literal
from langgraph.graph import END, START, MessagesState, StateGraph
from langgraph.graph.state import CompiledStateGraph

from .create_llm import create_llm
from .tools import *

tools = [parce_cryptocurrencies, parce_weather]
tools_by_name = {tool.name: tool for tool in tools}
agent: Any | None = None

def llm_node(state: MessagesState):
    llm_with_tools = create_llm().bind_tools(tools)

    response = llm_with_tools.invoke(state["messages"])
    return {"messages": [response]}

def tool_node(state: MessagesState):
    """Performs the tool call"""

    result = []
    for tool_call in state["messages"][-1].tool_calls:
        tool = tools_by_name[tool_call["name"]]
        observation = tool.invoke(tool_call["args"])
        result.append(ToolMessage(content=str(observation), tool_call_id=tool_call["id"]))
    return {"messages": result}

def should_continue(state: MessagesState) -> Literal["tool_node", END]:
    """Decide if we should continue the loop or stop based upon whether the LLM made a tool call"""

    messages = state["messages"]
    last_message = messages[-1]

    if last_message.tool_calls:
        return "tool_node"

    return END

def create_graph():
    agent_builder = StateGraph(MessagesState)

    agent_builder.add_node("llm_node", llm_node)
    agent_builder.add_node("tool_node", tool_node)

    agent_builder.add_edge(START, "llm_node")
    agent_builder.add_conditional_edges(
        "llm_node",
        should_continue,
        ["tool_node", END]
    )
    agent_builder.add_edge("tool_node", "llm_node")

    return agent_builder.compile()

def get_agent() -> CompiledStateGraph:
    global agent
    if agent is None:
        agent = create_graph()
    return agent




