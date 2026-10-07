const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const AppUser = sequelize.define('AppUser', {
        personId: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            allowNull: false,
            field: 'PERSON_ID'
        },
        subscriptionDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            field: 'SUBSCRIPTION_DATE'
        },
        planId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
            field: 'PLAN_ID'
        },
        stripeCustomerId: {
            type: DataTypes.STRING(100),
            allowNull: true,
            field: 'STRIPE_CUSTOMER_ID'
        },
        subscriptionStatus: {
            type: DataTypes.ENUM(
                'NONE',
                'INCOMPLETE',
                'ACTIVE',
                'PAST_DUE',
                'CANCELED'
            ),
            allowNull: false,
            defaultValue: 'NONE',
            field: 'SUBSCRIPTION_STATUS'
        },
        stripeSubscriptionId: {
            type: DataTypes.STRING(100),
            allowNull: true,
            field: 'STRIPE_SUBSCRIPTION_ID'
        },
        approvedBy: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
            field: 'APPROVED_BY'
        }
    }, {
        tableName: 'APP_USER',
        timestamps: false
    });

    AppUser.associate = (models) => {
        AppUser.belongsTo(models.Person, {
            foreignKey: 'personId',
            as: 'person'
        });

        AppUser.belongsTo(models.UserPlan, {
            foreignKey: 'planId',
            as: 'plan'
        });

        AppUser.belongsTo(models.Admin, {
            foreignKey: 'approvedBy',
            as: 'approvedByAdmin'
        });

        AppUser.hasMany(models.GameMatch, {
            foreignKey: 'userId',
            as: 'gameMatches'
        });

        AppUser.hasMany(models.Streak, {
            foreignKey: 'userId',
            as: 'streaks'
        });

        AppUser.hasMany(models.Leaderboard, {
            foreignKey: 'userId',
            as: 'leaderboards'
        });

        AppUser.hasMany(models.Payment, {
            foreignKey: 'userId',
            as: 'payments'
        });

        AppUser.hasMany(models.Notification, {
            foreignKey: 'userId',
            as: 'notifications'
        });

        AppUser.hasMany(models.StoryAccess, {
            foreignKey: 'userId',
            as: 'storyAccesses'
        });

        AppUser.hasMany(models.DailyGameReward, {
            foreignKey: 'userId',
            as: 'dailyRewards'
        });

        AppUser.hasMany(models.UserGame, {
            foreignKey: 'userId',
            as: 'userGames'
        });
    };

    return AppUser;
};