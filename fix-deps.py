#!/usr/bin/env python3
import os.path
import difflib
import re

from glob import iglob

typings_glob = os.path.join(os.getcwd(), '**', '*.d.ts')

typing_initializer_issue = re.compile(r'(\s+(static )?readonly \S+) = (\S+;)')

def fix_typing_file(path):
    with open(path, 'r') as file:
        contents = file.readlines()

    fixes = [typing_initializer_issue.sub(r'\1: \3', line)
        for line in contents]

    if contents != fixes:
        diffs = difflib.context_diff(contents, fixes,
            path +' (original)', path + ' (fixed)', n=1)

        for diff in diffs:
            print(diff, end='')

        return path, fixes

    return None

if __name__ == '__main__':
    try:
        fixedFiles = [*filter(
            lambda x: x is not None,
            (fix_typing_file(path) for path in iglob(typings_glob, recursive=True))
        )]

        if len(fixedFiles) == 0:
            exit(0)

        input('Continue?\n')

    except KeyboardInterrupt:
        print(); exit(0)

    for path, fixes in fixedFiles:
        with open(path, 'w') as file:
            file.writelines(fixes)
        print('Fixed:', path)

