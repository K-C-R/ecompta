package com.edefence.ecompta.config;

import java.time.Duration;
import org.ehcache.config.builders.*;
import org.ehcache.jsr107.Eh107Configuration;
import org.hibernate.cache.jcache.ConfigSettings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.cache.JCacheManagerCustomizer;
import org.springframework.boot.autoconfigure.orm.jpa.HibernatePropertiesCustomizer;
import org.springframework.boot.info.BuildProperties;
import org.springframework.boot.info.GitProperties;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.interceptor.KeyGenerator;
import org.springframework.context.annotation.*;
import tech.jhipster.config.JHipsterProperties;
import tech.jhipster.config.cache.PrefixedKeyGenerator;

@Configuration
@EnableCaching
public class CacheConfiguration {

    private GitProperties gitProperties;
    private BuildProperties buildProperties;
    private final javax.cache.configuration.Configuration<Object, Object> jcacheConfiguration;

    public CacheConfiguration(JHipsterProperties jHipsterProperties) {
        JHipsterProperties.Cache.Ehcache ehcache = jHipsterProperties.getCache().getEhcache();

        jcacheConfiguration =
            Eh107Configuration.fromEhcacheCacheConfiguration(
                CacheConfigurationBuilder
                    .newCacheConfigurationBuilder(Object.class, Object.class, ResourcePoolsBuilder.heap(ehcache.getMaxEntries()))
                    .withExpiry(ExpiryPolicyBuilder.timeToLiveExpiration(Duration.ofSeconds(ehcache.getTimeToLiveSeconds())))
                    .build()
            );
    }

    @Bean
    public HibernatePropertiesCustomizer hibernatePropertiesCustomizer(javax.cache.CacheManager cacheManager) {
        return hibernateProperties -> hibernateProperties.put(ConfigSettings.CACHE_MANAGER, cacheManager);
    }

    @Bean
    public JCacheManagerCustomizer cacheManagerCustomizer() {
        return cm -> {
            createCache(cm, com.edefence.ecompta.repository.UserRepository.USERS_BY_LOGIN_CACHE);
            createCache(cm, com.edefence.ecompta.repository.UserRepository.USERS_BY_EMAIL_CACHE);
            createCache(cm, com.edefence.ecompta.domain.User.class.getName());
            createCache(cm, com.edefence.ecompta.domain.Authority.class.getName());
            createCache(cm, com.edefence.ecompta.domain.User.class.getName() + ".authorities");
            createCache(cm, com.edefence.ecompta.domain.Compte.class.getName());
            createCache(cm, com.edefence.ecompta.domain.Compte.class.getName() + ".transactions");
            createCache(cm, com.edefence.ecompta.domain.Compte.class.getName() + ".soldeComptables");
            createCache(cm, com.edefence.ecompta.domain.Compte.class.getName() + ".compteAttentes");
            createCache(cm, com.edefence.ecompta.domain.Compte.class.getName() + ".compteTransferts");
            createCache(cm, com.edefence.ecompta.domain.Compte.class.getName() + ".audits");
            createCache(cm, com.edefence.ecompta.domain.Compte.class.getName() + ".pieceComptables");
            createCache(cm, com.edefence.ecompta.domain.Transaction.class.getName());
            createCache(cm, com.edefence.ecompta.domain.Transaction.class.getName() + ".pieceComptables");
            createCache(cm, com.edefence.ecompta.domain.CompteAttente.class.getName());
            createCache(cm, com.edefence.ecompta.domain.CompteTransfert.class.getName());
            createCache(cm, com.edefence.ecompta.domain.SoldeComptable.class.getName());
            createCache(cm, com.edefence.ecompta.domain.Bilan.class.getName());
            createCache(cm, com.edefence.ecompta.domain.Bilan.class.getName() + ".comptes");
            createCache(cm, com.edefence.ecompta.domain.CompteDeResultat.class.getName());
            createCache(cm, com.edefence.ecompta.domain.Resultat.class.getName());
            createCache(cm, com.edefence.ecompta.domain.Resultat.class.getName() + ".comptesDeResultats");
            createCache(cm, com.edefence.ecompta.domain.RapportsPersonnalises.class.getName());
            createCache(cm, com.edefence.ecompta.domain.Audit.class.getName());
            createCache(cm, com.edefence.ecompta.domain.PieceComptable.class.getName());
            createCache(cm, com.edefence.ecompta.domain.PieceComptable.class.getName() + ".comptes");
            createCache(cm, com.edefence.ecompta.domain.PieceComptable.class.getName() + ".transactions");
            createCache(cm, com.edefence.ecompta.domain.EcritureComptable.class.getName());
            createCache(cm, com.edefence.ecompta.domain.Balance.class.getName());
            createCache(cm, com.edefence.ecompta.domain.GrandLivre.class.getName());
            createCache(cm, com.edefence.ecompta.domain.JournalDefinitif.class.getName());
            // jhipster-needle-ehcache-add-entry
        };
    }

    private void createCache(javax.cache.CacheManager cm, String cacheName) {
        javax.cache.Cache<Object, Object> cache = cm.getCache(cacheName);
        if (cache != null) {
            cache.clear();
        } else {
            cm.createCache(cacheName, jcacheConfiguration);
        }
    }

    @Autowired(required = false)
    public void setGitProperties(GitProperties gitProperties) {
        this.gitProperties = gitProperties;
    }

    @Autowired(required = false)
    public void setBuildProperties(BuildProperties buildProperties) {
        this.buildProperties = buildProperties;
    }

    @Bean
    public KeyGenerator keyGenerator() {
        return new PrefixedKeyGenerator(this.gitProperties, this.buildProperties);
    }
}
