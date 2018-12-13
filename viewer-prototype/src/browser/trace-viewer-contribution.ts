/********************************************************************************
 * Copyright (C) 2018 Ericsson and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/

import { injectable, inject } from 'inversify';
import URI from '@theia/core/lib/common/uri';
import { WidgetOpenHandler } from '@theia/core/lib/browser';
import { WorkspaceService } from '@theia/workspace/lib/browser';
import { Command, CommandRegistry, CommandContribution, MessageService } from '@theia/core';
import { TraceViewerWidget, TraceViewerWidgetOptions } from './trace-viewer-widget';
import { TraceServer } from '../common/trace-server-protocol';

export namespace TraceViewerCommands {
    export const OPEN: Command = {
        id: 'trace:open',
        label: 'Open Trace'
    };
    export const LIST_LOGS: Command = {
        id: 'trace:list:logs',
        label: 'List Log Files'
    }
}

@injectable()
export class TraceViewerContribution extends WidgetOpenHandler<TraceViewerWidget> implements CommandContribution {

    @inject(WorkspaceService) protected readonly workspaceService!: WorkspaceService;
    @inject(MessageService) protected readonly messageService!: MessageService;
    @inject(TraceServer) protected readonly traceServer!: TraceServer;

    // The ID makes the link between the widget factory and this widget open handler.
    readonly id = TraceViewerWidget.ID;

    // Name of the handler that should show in the context menu.
    readonly label = 'Open trace';

    // Whether or not the URI is handled by the TraceViewer.
    // Arbitrary number representing the priority for this handler over someone else.
    canHandle(uri: URI): number {
        return 100;
    }

    // At this point, you are given the URI from the file navigator,
    // this method should use it to do whatever it needs in order to
    // configure the options passed to the widget.
    protected createWidgetOptions(uri: URI): TraceViewerWidgetOptions {
        return {
            traceURI: uri.path.toString()
        };
    }

    // Register a new command (not handled in this case).
    registerCommands(registry: CommandRegistry): void {
        registry.registerCommand(TraceViewerCommands.OPEN);
        registry.registerCommand(TraceViewerCommands.LIST_LOGS, {
            execute: async () => {
                const roots = await this.workspaceService.roots;
                const logFiles = await this.traceServer.listLogFiles(
                    new URI(roots[0].uri).path.toString()
                );
                for (const logFile of logFiles) {
                    this.messageService.info(logFile);
                }
            }
        });
    }
}
