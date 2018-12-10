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

import { ContainerModule, Container } from 'inversify';
import { WidgetFactory, OpenHandler, FrontendApplicationContribution } from '@theia/core/lib/browser';
import { TraceViewerWidget, TraceViewerWidgetOptions } from './trace-viewer-widget';
import { TraceViewerContribution } from './trace-viewer-contribution';
import { CommandContribution } from '@theia/core/lib/common';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import '../../src/browser/style/trace-viewer.css';

export default new ContainerModule(bind => {

    // Someone ask for a `TraceViewerWidget`, then actually give a `TraceViewerWidget` instance.
    // We use the reference to the class as identifier, and we bind this id to the class itself, which will be use to create new objects to resolve dependencies.
    // In this case, everytime someone asks for this service, a new one is instanciated (not a singleton).
    bind(TraceViewerWidget).toSelf();

    // WidgetFactory instances can have an `id` and a method called `createWidget`.
    // In this binding, we create an object implementing that interface on the go.
    bind<WidgetFactory>(WidgetFactory).toDynamicValue(context =>

        // WidgetFactory implementation that will create the TraceViewerWidget
        // Despite the ({}) notation, we are just defining a JS object here.
        ({
            id: TraceViewerWidget.ID,

            async createWidget(options: TraceViewerWidgetOptions): Promise<TraceViewerWidget> {

                // Setup a small container to wire our component without changing global bindings
                // Default scope only affects new bindings within the child container, not the old/parent ones.
                const child = new Container({ defaultScope: 'Singleton' });
                child.parent = context.container;

                // Bind options passed to the factory so that it can be injected in the component
                child.bind(TraceViewerWidgetOptions).toConstantValue(options);

                // Resolve the dependencies and inject what needs to be injected
                return child.get(TraceViewerWidget);
            }
        })

    // Only resolve this dependency once, then cache and reuse the value.
    ).inSingletonScope();

    // If you understood the lines before, this should be self explanatory.
    bind(TraceViewerContribution).toSelf().inSingletonScope();

    // Bind the component to all the contribution points it will contribute too.
    [CommandContribution, OpenHandler, FrontendApplicationContribution].forEach(serviceIdentifier =>
        bind(serviceIdentifier).toService(TraceViewerContribution)
    );
});
