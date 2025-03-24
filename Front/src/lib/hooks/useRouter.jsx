export default function useRouter() {
    const ROUTES = import.meta.glob('../../routes/**/*.jsx', { eager: true });

    const routes = Object.keys(ROUTES).map((route) => {
        const path = route
          	.toLowerCase()
			.split('/routes')[1]
          	.replace(/\.\/routes|index|\.jsx$/g, '')
          	.replace(/\[\.{3}.+\]/, '*')
          	.replace(/\[(.+)\]/, ':$1');
      
        return { path, component: ROUTES[route].default };
    });

    return routes;
}