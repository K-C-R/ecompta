import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'compte',
        data: { pageTitle: 'eComptaApp.compte.home.title' },
        loadChildren: () => import('./compte/compte.routes'),
      },
      {
        path: 'transaction',
        data: { pageTitle: 'eComptaApp.transaction.home.title' },
        loadChildren: () => import('./transaction/transaction.routes'),
      },
      {
        path: 'compte-attente',
        data: { pageTitle: 'eComptaApp.compteAttente.home.title' },
        loadChildren: () => import('./compte-attente/compte-attente.routes'),
      },
      {
        path: 'compte-transfert',
        data: { pageTitle: 'eComptaApp.compteTransfert.home.title' },
        loadChildren: () => import('./compte-transfert/compte-transfert.routes'),
      },
      {
        path: 'solde-comptable',
        data: { pageTitle: 'eComptaApp.soldeComptable.home.title' },
        loadChildren: () => import('./solde-comptable/solde-comptable.routes'),
      },
      {
        path: 'bilan',
        data: { pageTitle: 'eComptaApp.bilan.home.title' },
        loadChildren: () => import('./bilan/bilan.routes'),
      },
      {
        path: 'compte-de-resultat',
        data: { pageTitle: 'eComptaApp.compteDeResultat.home.title' },
        loadChildren: () => import('./compte-de-resultat/compte-de-resultat.routes'),
      },
      {
        path: 'resultat',
        data: { pageTitle: 'eComptaApp.resultat.home.title' },
        loadChildren: () => import('./resultat/resultat.routes'),
      },
      {
        path: 'rapports-personnalises',
        data: { pageTitle: 'eComptaApp.rapportsPersonnalises.home.title' },
        loadChildren: () => import('./rapports-personnalises/rapports-personnalises.routes'),
      },
      {
        path: 'audit',
        data: { pageTitle: 'eComptaApp.audit.home.title' },
        loadChildren: () => import('./audit/audit.routes'),
      },
      {
        path: 'piece-comptable',
        data: { pageTitle: 'eComptaApp.pieceComptable.home.title' },
        loadChildren: () => import('./piece-comptable/piece-comptable.routes'),
      },
      {
        path: 'ecriture-comptable',
        data: { pageTitle: 'eComptaApp.ecritureComptable.home.title' },
        loadChildren: () => import('./ecriture-comptable/ecriture-comptable.routes'),
      },
      {
        path: 'balance',
        data: { pageTitle: 'eComptaApp.balance.home.title' },
        loadChildren: () => import('./balance/balance.routes'),
      },
      {
        path: 'grand-livre',
        data: { pageTitle: 'eComptaApp.grandLivre.home.title' },
        loadChildren: () => import('./grand-livre/grand-livre.routes'),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
