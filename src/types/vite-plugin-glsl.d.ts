declare module 'vite-plugin-glsl' {
    import { Plugin } from 'vite'
    function glsl(options?: {
        include?: string | string[]
        exclude?: string | string[]
        defaultExtension?: string
        compress?: boolean
    }): Plugin
    export default glsl
}