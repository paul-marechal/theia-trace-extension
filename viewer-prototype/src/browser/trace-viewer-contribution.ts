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

import { injectable } from 'inversify';
import { Command, CommandRegistry, CommandContribution } from '@theia/core';
import { WidgetOpenHandler } from '@theia/core/lib/browser';
import URI from '@theia/core/lib/common/uri';
import { TraceViewerWidget, TraceViewerWidgetOptions } from './trace-viewer-widget';

export namespace TraceViewerCommands {
    export const OPEN: Command = {
        id: 'trace:open',
        label: 'Open Trace'
    };
}

@injectable()
export class TraceViewerContribution extends WidgetOpenHandler<TraceViewerWidget> implements CommandContribution {

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
    }
}
