import resolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
import pkg from "./package.json";

const extensions = ['.js', '.ts']

export default [
// CommonJS (for Node) and ES module (for bundlers) build.
    {
        input: 'src/chartjs-plugin-cyclic-axis.js',
        output: [
            {
                file: pkg.main,
                format: 'cjs'
            }
        ],
        plugins: [
            babel({
                exclude: ["node_modules/**"],
                extensions
            }),
            resolve({
                extensions
            }),
        ]
    }
];