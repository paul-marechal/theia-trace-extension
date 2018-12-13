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

import * as fs from 'fs';
import { injectable } from 'inversify';
import { TraceServer } from '../common/trace-server-protocol';

@injectable()
export class TraceServerImpl implements TraceServer {

    protected async listFiles(directory: string): Promise<string[]> {
        return new Promise<string[]>((resolve, reject) => {
            fs.readdir(directory, { encoding: 'utf8' }, (err, files) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(files);
            });
        });
    }

    async listLogFiles(directory: string) {
        const files = await this.listFiles(directory);
        return files.filter(file => file.endsWith('.log'));
    }

}
