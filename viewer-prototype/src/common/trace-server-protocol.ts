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

/**
 * In order to know what service to access from the frontend,
 * we need to use a unique path, representing our service/server.
 * Its just a string.
 */
export const traceServerPath = '/services/trace-server';

/**
 * When defining a protocol, everything has to return promises.
 * Reason is that because the function calls will go over the wire, you cannot wait for it synchronously.
 */
export const TraceServer = Symbol('TraceRandomServer');
export interface TraceServer {

    listLogFiles(directory: string): Promise<string[]>;

}
