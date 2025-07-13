"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.

Asyncio utility methods
"""
import asyncio
import logging
from asyncio import AbstractEventLoop
from contextlib import suppress

def cancel_all_tasks(log: logging.Logger, loop: AbstractEventLoop):
    # cancel all running tasks and do proper shutdown of websocket:
    pending = asyncio.Task.all_tasks()
    log.debug("Cancelling {} pending tasks".format(len(pending)))
    for task in pending:
        task.cancel()
        # Now we should await task to execute it's cancellation.
        # Cancelled task raises asyncio.CancelledError that we can suppress:
        with suppress(asyncio.CancelledError):
            loop.run_until_complete(task)

