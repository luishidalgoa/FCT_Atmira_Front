# ATMIRA FTC SISTEMA GESTION PROYECTOS
<div align="center">
   <a href="https://github.com/luishidalgoa/FCT_Atmira_Front"></a>
      <img src="https://github.com/luishidalgoa/FCT_Atmira_Front/blob/master/src/assets/atmira_logo.png" alt="Logo" width="200" />
   </a>
</div>

## Índice:

1. [Acerca de](#acerca-de)
2. [Caracteristicas principales](#características-principales)
    - [Detalles específicos del trabajo por proyecto](#detalles-especifícos-del-trabajo-por-proyecto)
    - [Registro eficiente de horas trabajadas](#registro-eficiente-de-horas-trabajadas)
    - [Gestión integrada de gastos de empresa](#gestión-integrada-de-gastos-de-empresa)
    - [Análisis predictivo con IA](#análisis-predictivo-con-ia)
3. [Pre requisitos](#pre-requisitos)
    - [Node.js](#nodejs-httpsnodejsorgen)
    - [API (Back-End)](#api-back-end)
4. [Instalacíon](#instalacíon)
5. [Colaborar](#colaborar)
   - [Guía rápida](#guía-rápida)
6. [Colaboradores](#colaboradores)
7. [Stack Tecnologías](#stack-tecnologías)

## Acerca de:
La usabilidad de nuestra aplicación de gestión de proyectos se centra en proporcionar una experiencia intuitiva y eficiente para los usuarios, permitiéndoles gestionar proyectos y tareas de manera fluida y colaborativa. Desde la creación de proyectos hasta la asignación y seguimiento de tareas, cada paso se ha diseñado cuidadosamente para ser accesible y fácil de entender.

![screely-1710101872192](https://github.com/luishidalgoa/FCT_Atmira_Front/assets/119078933/9f3ba9ff-1310-4c6f-a887-ea69186722a6)
<footer>
  
> Relased Version V-1.0
  
</footer>

## Características principales:
### Detalles especifícos del trabajo por proyecto:
  - Posibilidad de registrar detalles específicos sobre el trabajo realizado en cada proyecto.
  - Organización clara y detallada de tareas y subtareas dentro de cada proyecto, similar a herramientas de gestión de proyectos como Jira.
### Registro Eficiente de Horas Trabajadas:
  - Interfaz intuitiva que facilita el ingreso de las horas trabajadas diariamente.
  - Seguimiento preciso de la carga laboral en cada jornada, lo que ayuda a gestionar el tiempo de manera efectiva.
### Gestión Integrada de Gastos de Empresa:
  - Registro de gastos asociados a proyectos específicos de manera sencilla.
  - Información detallada sobre cada gasto, incluyendo descripción, fecha y monto gastado, para un seguimiento preciso de los costos del proyecto.
### Análisis Predictivo con IA:
  - Utilización de inteligencia artificial para obtener estadísticas y previsión de gastos, tiempos de demora, y otros indicadores relevantes.
  - Facilita la toma de decisiones mediante una visión analítica que mejora la eficiencia en la gestión del proyecto.
## Pre requisitos:
### Node.JS: [https://nodejs.org/en](https://nodejs.org/en)
### API (BACK-END):
Para el Back-end te ofrecemos 2 alternativas. Una de ellas retroalimentarlo tu mismo a tu medida. En caso contrario podrás conectar el front-end al backend ya desplegado en un Hosting
1. Clona el repositorio del Back: [luishidalgoa/Atmira_Backend](https://github.com/luishidalgoa/Atmira_Backend)
    - Documentación SWAGGER de la Api en localhost [http://localhost:8080/swagger-ui/index.html#/](http://localhost:8080/swagger-ui/index.html#/)
    - Documentación Postman de la Api [https://documenter.getpostman.com/view/32223959/2sA2xnwUY2#cce848b9-a06f-44de-8983-049db3496769](https://documenter.getpostman.com/view/32223959/2sA2xnwUY2#cce848b9-a06f-44de-8983-049db3496769)
2. Usa nuestro Hosting
    - Enlace de conexión: [https://atmira-backend.onrender.com](https://atmira-backend.onrender.com)
    - Swagger con la documentación de la API: [https://atmira-backend.onrender.com/swagger-ui/index.html#/](https://atmira-backend.onrender.com/swagger-ui/index.html#/)
## Instalacíon:
1. Clona el repositorio [https://github.com/luishidalgoa/FCT_Atmira_Front](https://github.com/luishidalgoa/FCT_Atmira_Front)
2. Instala los paquetes NPM:
```sh
Npm install
```
3.	Instala Angular Materials manualmente
```sh
ng add @angular/material
```
4.	Ejecuta el compilador automatico de Angular
```sh
Ng serve
```
> [!WARNING]
> Hemos detectado un Bug de Angular materials. Probablemente el compilador después de haber ejecutado todos los pasos anteriores te imprima por pantalla un error de que no compila el Style.SCSS. Desconocemos el motivo de este error. Pero para solucionarlo elimina el package.lock.json dentro del directorio raíz del proyecto, además del directorio node_module. Acto seguido vuelve a ejecutar `Npm install` y `ng add @angular/material`

## Colaborar:
### Guía rápida:

1. Haz un [_fork_](https://github.com/luishidalgoa/FCT_Atmira_Front/fork) del Proyecto
2. Clona tu [_fork_](https://github.com/luishidalgoa/FCT_Atmira_Front/fork) (`git clone <URL del fork>`)
3. Añade el repositorio original como remoto (`git remote add upstream <URL del repositorio original>`)
4. Crea tu Rama de Funcionalidad (`git switch -c feature/CaracteristicaIncreible`)
5. Realiza tus Cambios (`git commit -m 'Add: alguna CaracterísticaIncreible'`)
6. Haz Push a la Rama (`git push origin feature/CaracteristicaIncreible`)
7. Abre una [_pull request_](https://github.com/luishidalgoa/FCT_Atmira_Front/pulls)
### Colaboradores:
[![Contribuidores](https://contrib.rocks/image?repo=luishidalgoa/FCT_Atmira_Front)](https://github.com/luishidalgoa/FCT_Atmira_Front/graphs/contributors)
## Stack Tecnologías:
![image](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![image](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)
![image](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![image](https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![image](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![image](https://img.shields.io/badge/Adobe%20XD-470137?style=for-the-badge&logo=Adobe%20XD&logoColor=#FF61F6)
